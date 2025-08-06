"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Header, AvatarMinter } from "@/components";
import { FAQ } from "@/components/ui/FAQ";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useAlvaraMint } from "@/hooks/useAlvaraMint";
import { useVeAlvaBalance } from "@/hooks/useAlvaBalance";
import { useWalletNFTs } from "@/hooks/useWalletNFTs";
import { useNotification } from "@/contexts/NotificationContext";

export default function Home() {
  const { isConnected } = useAccount();
  const [mintedNFTs, setMintedNFTs] = useState<any[]>([]);
  const { showNotification } = useNotification();

  // Smart contract integration
  const { isMintSuccess, transactionHash } = useAlvaraMint();

  // User's owned NFTs from wallet
  const {
    ownedNFTs,
    isLoading: isLoadingWalletNFTs,
    error: walletNFTsError,
    refetch: refetchWalletNFTs,
    totalNFTs,
  } = useWalletNFTs();

  // Listen for successful mints (only once per transaction)
  useEffect(() => {
    if (isMintSuccess && transactionHash) {
      // Check if we've already processed this transaction
      const hasProcessedThis = mintedNFTs.some((nft) =>
        nft.id.includes(transactionHash.slice(-8))
      );

      if (!hasProcessedThis) {
        // Create a new minted NFT entry
        const newMintedNFT = {
          id: `minted-${transactionHash.slice(-8)}`,
          name: "Alvara NFT",
          image: "/images/nfts/1.png", // Default image
          transactionHash: transactionHash,
        };
        setMintedNFTs((prev) => [...prev, newMintedNFT]);

        showNotification({
          type: "success",
          title: "Transaction Confirmed!",
          message: "Successfully minted your Alvara NFT",
          link: {
            url: `https://sepolia.etherscan.io/tx/${transactionHash}`,
            text: "View Transaction on Etherscan",
          },
        });
      }
    }
  }, [isMintSuccess, transactionHash, mintedNFTs, showNotification]);

  const shareOnX = (nft: any, transactionHash?: string) => {
    const url = transactionHash
      ? `https://sepolia.etherscan.io/tx/${transactionHash}`
      : "https://alvara-nft.com";
    const text = `🎉 Just minted ${nft.name}! 

✨ Check it out on the blockchain! #AlvaraNFT #NFT #Ethereum #Blockchain`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <main className="relative overflow-x-hidden min-h-screen">
      <Header />

      {/* Top-left Vector */}
      <div className="fixed top-[97px] left-0 z-0 pointer-events-none">
        <Image
          src="/images/top-left.svg"
          alt="Top-left decorative vector"
          width={150}
          height={150}
          className="opacity-50"
          priority
        />
      </div>

      {/* Top-right Vector */}
      <div className="fixed top-[97px] right-0 z-0 pointer-events-none">
        <Image
          src="/images/top-right.svg"
          alt="Top-right decorative vector"
          width={150}
          height={150}
          className="opacity-50"
          priority
        />
      </div>

      <div
        className="relative flex flex-row justify-evenly "
        style={{
          height: "100vh",
          // paddingTop: "97px",
          marginTop: "130px",
        }}
      >
        {/* Left Side - Marketing Text */}
        <div
          className="w-1/3 flex flex-col justify-center items-center "
          style={{ paddingTop: "180px" }}
        >
          {/* Headline Section */}
          <div
            className="mb-8 "
            style={{
              width: "356px",
              height: "160px",
              top: "303px",
              left: "108px",
              gap: "10px",
              transform: "rotate(0deg)",
              opacity: 1,
            }}
          >
            <h1
              style={{
                fontFamily: "PP Supply Sans, Titillium Web",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "64px",
                lineHeight: "125%",
                letterSpacing: "0%",
              }}
            >
              <span style={{ color: "#D73D80" }}>Mint NFTs.</span>
              <br />
              <span style={{ color: "#FDF2FF" }}>Mint Legacy.</span>
            </h1>
          </div>

          {/* Sub-heading Section */}
          <div
            className="max-w-md "
            style={{
              width: "350px",
              height: "90px",

              // gap: "10px",
              transform: "rotate(0deg)",
              opacity: 1,
            }}
          >
            <p
              style={{
                fontFamily: "Titillium Web",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "20px",
                lineHeight: "150%",
                letterSpacing: "0%",
                color: "#B9A7C0",
              }}
            >
              Minting a new generation of tokenised basket managers.
            </p>
          </div>
        </div>

        {/* Center side - NFT Interface */}
        <div
          className="w-1/3 flex flex-col justify-center items-center "
          style={{
            height: "auto",
            minHeight: "750px",
            gap: "32px",
            transform: "rotate(0deg)",
            opacity: 1,
            paddingBottom: "50px",
          }}
        >
          {/* Text Section */}
          <div
            className="text-center mb-8"
            style={{
              width: "373px",
              height: "84px",
              gap: "10px",
              transform: "rotate(0deg)",
              opacity: 1,
            }}
          >
            <h2
              style={{
                fontFamily: "Titillium Web",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "32px",
                lineHeight: "48.59px",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#B9A7C0",
                marginBottom: "10px",
              }}
            >
              Choose your avatar
            </h2>
            <p
              style={{
                fontFamily: "Titillium Web",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "20px",
                lineHeight: "125%",
                letterSpacing: "0%",
                color: "#B199B5",
              }}
            >
              Select your avatar and mint your unique NFT
            </p>
          </div>

          {/* Avatar Frame with Side Vectors */}
          <div className="relative">
            {/* Left Vector */}
            <div className="absolute left-[-200px] bottom-0 z-0 pointer-events-none">
              <Image
                src="/images/left.svg"
                alt="Left decorative vector"
                width={200}
                height={200}
                className="opacity-50"
                priority
              />
            </div>

            {/* Avatar Frame */}
            <div
              style={{
                width: "368px",
                height: "608px",
                background: "#7861851A",
                border: "1px solid #786185",
                borderRadius: "0px",
                padding: "32px 56px 32px 56px",
                gap: "32px",
                transform: "rotate(0deg)",
                opacity: 1,
              }}
            >
              <AvatarMinter />
            </div>

            {/* Right Vector */}
            <div className="absolute right-[-200px] bottom-0 z-0 pointer-events-none">
              <Image
                src="/images/right.svg"
                alt="Right decorative vector"
                width={200}
                height={200}
                className="opacity-50"
                priority
              />
            </div>
          </div>
        </div>
        {/* Right Side Text */}
        <div className="w-1/3 flex flex-col justify-center ">
          <h2
            style={{
              fontFamily: "PP Supply Sans, Titillium Web, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "32px",
              lineHeight: "125%",
              letterSpacing: "0%",
              color: "#D73D80",
              marginBottom: "16px",
            }}
          >
            Who is an Investment Wanker?
          </h2>
          <p
            style={{
              fontFamily: "Supply Sans",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "#B9A7C0",
              marginBottom: "12px",
            }}
          >
            A satire on TradFi bros who missed the memo.
          </p>
          <p
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "#B9A7C0",
              marginBottom: "12px",
            }}
          >
            But also, a real yield-generating NFT.
          </p>
          <p
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "#B9A7C0",
              marginBottom: "12px",
            }}
          >
            Here's the kicker:
          </p>
          <p
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "#B9A7C0",
              marginBottom: "12px",
            }}
          >
            100% of the mint funds are used to buy ALVA and airdropped back to
            holders after 6 months.
          </p>
          <p
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "#B9A7C0",
              marginBottom: "12px",
            }}
          >
            Mint open for 7 days only.
          </p>
          <p
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "#B9A7C0",
            }}
          >
            You're either in, or you're an investment wanker.
          </p>
        </div>
      </div>

      {/* Recently Minted NFTs Section (from current session) */}
      {mintedNFTs.length > 0 && (
        <div className="mt-16 w-full px-4 sm:px-6 lg:px-8">
          <h3
            className="text-lg font-semibold text-white mb-4 flex items-center justify-center"
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 700,
              fontSize: "24px",
              lineHeight: "125%",
            }}
          >
            🎉 Recently Minted
          </h3>

          {/* Progress Bar */}
          <div className="mb-6 max-w-4xl mx-auto">
            <div className="flex justify-between text-sm text-[#D8CDE2] mb-2">
              <span>Collection Progress</span>
              <span>{mintedNFTs.length}/10 Minted</span>
            </div>
            <div className="w-full bg-[#2A1F3B] rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#D73D80] to-[#9B51E0] h-2 rounded-full transition-all duration-500"
                style={{ width: `${(mintedNFTs.length / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Minted NFTs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 max-w-6xl mx-auto">
            {mintedNFTs.map((nft, index) => (
              <div
                key={`${nft.id}-${index}`}
                className="relative bg-[#2A1F3B]/50 rounded-lg p-3 border border-[#786185]/30 hover:border-[#D73D80]/50 transition-all duration-200 group"
              >
                <div className="relative w-full aspect-square mb-2">
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    fill
                    sizes="150px"
                    className="object-contain rounded"
                  />

                  {/* Share Button - appears on hover */}
                  <button
                    onClick={() => shareOnX(nft, nft.transactionHash)}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-[#1DA1F2] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Share on X"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-white"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                </div>
                <p className="text-white text-xs font-medium truncate">
                  {nft.name}
                </p>
                <p className="text-[#D8CDE2]/70 text-xs">Just minted!</p>
              </div>
            ))}
          </div>

          {/* Share Collection Button - only show after 3+ NFTs */}
          {mintedNFTs.length >= 3 && (
            <div className="text-center max-w-4xl mx-auto">
              <button
                onClick={() => {
                  const text = `🚀 Just minted ${mintedNFTs.length} Alvara NFTs! 

Join the collection at alvara-nft.com 

#AlvaraNFT #NFTCollection #Ethereum #Blockchain`;
                  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    text
                  )}`;
                  window.open(twitterUrl, "_blank");
                }}
                className="bg-[#1DA1F2] hover:bg-[#1A91DA] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share Collection on X
              </button>
            </div>
          )}
        </div>
      )}

      {/* Your Minted Alvaras Section */}
      <div className="mt-16 w-full relative z-10 pb-16 px-4 sm:px-6 lg:px-8">
        <h2
          className="text-2xl font-bold text-white mb-6 text-center"
          style={{
            fontFamily: "Titillium Web",
            fontWeight: 700,
            fontSize: "32px",
            lineHeight: "125%",
          }}
        >
          Your Minted Alvaras
        </h2>

        {/* Wallet NFTs Section */}
        {isLoadingWalletNFTs ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D73D80] mx-auto mb-4"></div>
            <p className="text-[#D8CDE2]">Loading your NFTs...</p>
          </div>
        ) : walletNFTsError ? (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">
              Error loading NFTs: {walletNFTsError}
            </p>
            <button
              onClick={() => refetchWalletNFTs()}
              className="bg-[#D73D80] hover:bg-[#B8316C] text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : ownedNFTs && ownedNFTs.length > 0 ? (
          <div className="max-w-7xl mx-auto">
            <p className="text-[#D8CDE2] text-center mb-6">
              You own {totalNFTs} Alvara NFT{totalNFTs !== 1 ? "s" : ""}
            </p>

            {/* NFTs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {ownedNFTs.map((nft, index) => (
                <div
                  key={`owned-${nft.tokenId}-${index}`}
                  className="relative bg-[#2A1F3B]/50 rounded-lg p-3 border border-[#786185]/30 hover:border-[#D73D80]/50 transition-all duration-200 group"
                >
                  <div className="relative w-full aspect-square mb-2">
                    <Image
                      src={
                        nft.imageUrl ||
                        nft.metadata?.image ||
                        "/images/nfts/placeholder.png"
                      }
                      alt={nft.name || `Alvara #${nft.tokenId}`}
                      fill
                      sizes="150px"
                      className="object-contain rounded"
                    />

                    {/* Share Button - appears on hover */}
                    <button
                      onClick={() =>
                        shareOnX({
                          id: nft.tokenId.toString(),
                          number: nft.tokenId,
                          name: nft.name || `Alvara #${nft.tokenId}`,
                          description:
                            nft.metadata?.description ||
                            "A unique Alvara NFT from the collection",
                          price: 0.00055,
                          image:
                            nft.imageUrl ||
                            nft.metadata?.image ||
                            "/images/nfts/placeholder.png",
                        })
                      }
                      className="absolute top-2 right-2 bg-black/70 hover:bg-[#1DA1F2] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                      title="Share on X"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-white"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-white text-xs font-medium truncate">
                    {nft.name || `Alvara #${nft.tokenId}`}
                  </p>
                  <p className="text-[#D8CDE2]/70 text-xs">
                    Token #{nft.tokenId}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* No NFTs State */
          <div className="text-center py-12 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2A1F3B] flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-[#786185]"
              >
                <path
                  d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7l-10-5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-[#D8CDE2] mb-2">No minted NFTs yet</p>
            <p className="text-[#D8CDE2]/70 text-sm">
              Start minting to see your collection here!
            </p>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="pt-32 pb-16">
        <FAQ />
      </div>

      {/* Footer Vector */}
      <div className="w-full z-0 pointer-events-none">
        <Image
          src="/images/footer.svg"
          alt="Footer decorative vector"
          width={1920}
          height={20}
          className="opacity-30 w-full h-auto"
          priority
        />
      </div>
    </main>
  );
}
