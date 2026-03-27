#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype,
    Address, Env, String, Symbol, symbol_short,
};

// ── Storage keys ────────────────────────────────────────────────────────────

const AUCTION_COUNT: Symbol = symbol_short!("A_COUNT");
const PLATFORM_FEE: Symbol = symbol_short!("P_FEE");

#[contracttype]
#[derive(Clone)]
pub struct Auction {
    pub id: u64,
    pub seller: Address,
    pub title: String,
    pub starting_price: i128,
    pub highest_bid: i128,
    pub highest_bidder: Address,
    pub end_time: u64,
    pub settled: bool,
    pub active: bool,
}

#[contracttype]
pub enum DataKey {
    Auction(u64),
    PendingReturn(u64, Address),
}

// ── Contract ─────────────────────────────────────────────────────────────────

#[contract]
pub struct TrustBidContract;

#[contractimpl]
impl TrustBidContract {
    /// Initialize the contract with a platform fee (basis points, e.g. 250 = 2.5%)
    pub fn initialize(env: Env, platform_fee: u32) {
        env.storage().instance().set(&PLATFORM_FEE, &platform_fee);
        env.storage().instance().set(&AUCTION_COUNT, &0u64);
    }

    /// Create a new auction
    pub fn create_auction(
        env: Env,
        seller: Address,
        title: String,
        starting_price: i128,
        duration_seconds: u64,
    ) -> u64 {
        seller.require_auth();

        assert!(starting_price > 0, "starting price must be > 0");
        assert!(duration_seconds >= 3600, "duration must be at least 1 hour");
        assert!(duration_seconds <= 2_592_000, "duration must be at most 30 days");

        let count: u64 = env.storage().instance().get(&AUCTION_COUNT).unwrap_or(0);
        let id = count + 1;
        let end_time = env.ledger().timestamp() + duration_seconds;

        let auction = Auction {
            id,
            seller: seller.clone(),
            title,
            starting_price,
            highest_bid: 0,
            highest_bidder: seller,
            end_time,
            settled: false,
            active: true,
        };

        env.storage().persistent().set(&DataKey::Auction(id), &auction);
        env.storage().instance().set(&AUCTION_COUNT, &id);

        id
    }

    /// Place a bid on an auction
    pub fn place_bid(env: Env, auction_id: u64, bidder: Address, amount: i128) {
        bidder.require_auth();

        let mut auction: Auction = env
            .storage()
            .persistent()
            .get(&DataKey::Auction(auction_id))
            .expect("auction not found");

        assert!(auction.active, "auction is not active");
        assert!(
            env.ledger().timestamp() < auction.end_time,
            "auction has ended"
        );

        let min_bid = if auction.highest_bid > 0 {
            auction.highest_bid
        } else {
            auction.starting_price
        };

        assert!(amount > min_bid, "bid must exceed current highest bid");

        // Store pending return for previous highest bidder
        if auction.highest_bid > 0 {
            let key = DataKey::PendingReturn(auction_id, auction.highest_bidder.clone());
            let prev: i128 = env.storage().temporary().get(&key).unwrap_or(0);
            env.storage().temporary().set(&key, &(prev + auction.highest_bid));
        }

        auction.highest_bid = amount;
        auction.highest_bidder = bidder;

        env.storage().persistent().set(&DataKey::Auction(auction_id), &auction);
    }

    /// Settle an ended auction
    pub fn settle_auction(env: Env, auction_id: u64) {
        let mut auction: Auction = env
            .storage()
            .persistent()
            .get(&DataKey::Auction(auction_id))
            .expect("auction not found");

        assert!(auction.active, "auction is not active");
        assert!(
            env.ledger().timestamp() >= auction.end_time,
            "auction has not ended yet"
        );
        assert!(!auction.settled, "already settled");

        auction.settled = true;
        auction.active = false;

        env.storage().persistent().set(&DataKey::Auction(auction_id), &auction);
    }

    /// Get auction data
    pub fn get_auction(env: Env, auction_id: u64) -> Auction {
        env.storage()
            .persistent()
            .get(&DataKey::Auction(auction_id))
            .expect("auction not found")
    }

    /// Get total auction count
    pub fn auction_count(env: Env) -> u64 {
        env.storage().instance().get(&AUCTION_COUNT).unwrap_or(0)
    }
}

// ── Tests ────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env, String};

    #[test]
    fn test_create_and_bid() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, TrustBidContract);
        let client = TrustBidContractClient::new(&env, &contract_id);

        client.initialize(&250u32);

        let seller = Address::generate(&env);
        let bidder = Address::generate(&env);

        let id = client.create_auction(
            &seller,
            &String::from_str(&env, "Rare NFT"),
            &1_000_000i128,
            &7200u64, // 2 hours
        );
        assert_eq!(id, 1);

        client.place_bid(&id, &bidder, &2_000_000i128);

        let auction = client.get_auction(&id);
        assert_eq!(auction.highest_bid, 2_000_000i128);
    }
}
