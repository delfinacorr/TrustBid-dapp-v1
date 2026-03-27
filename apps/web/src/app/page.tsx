import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Trust<span className="text-indigo-600">Bid</span>
        </h1>
        <p className="text-xl text-gray-500 mb-8">
          Decentralized, trustless auctions on Ethereum. No middlemen. No BS.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auctions"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Browse Auctions
          </Link>
          <Link
            href="/auctions/create"
            className="border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Create Auction
          </Link>
        </div>
      </div>
    </main>
  );
}
