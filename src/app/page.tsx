"use client";

import { Header, AvatarMinter } from "@/components";
import { FAQ } from "@/components/ui/FAQ";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAlvaraMint } from "@/hooks/useAlvaraMint";
import { useWalletNFTs } from "@/hooks/useWalletNFTs";
import { useNotification } from "@/contexts/NotificationContext";

export default function Home() {
  const [mintedNFTs, setMintedNFTs] = useState<any[]>([]);
  const { showNotification } = useNotification();

  const { isMintSuccess, transactionHash, maxMintsPerWallet } = useAlvaraMint();

  const {
    ownedNFTs,
    isLoading: isLoadingWalletNFTs,
    error: walletNFTsError,
    refetch: refetchWalletNFTs,
    totalNFTs,
  } = useWalletNFTs();

  // Load Typeform script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//embed.typeform.com/next/embed.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (isMintSuccess && transactionHash) {
      // Check if we've already processed this transaction
      const hasProcessedThis = mintedNFTs.some((nft) =>
        nft.id.includes(transactionHash.slice(-8))
      );

      if (!hasProcessedThis) {
        const newMintedNFT = {
          id: `minted-${transactionHash.slice(-8)}`,
          name: "Basket Beth",
          image: "/images/nfts/Basket-Beth.png",
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
      : "https://pfp.alvara.xyz";

    // Create a more engaging tweet with the NFT image
    const text = `I'm now a certified Investment Wanker in @Alvaraprotocol, a real-yield-generating NFT. 

The minting window is closing. Are you another TradFi bro missing the memo?

${nft.image}`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <main className="relative overflow-x-hidden min-h-screen">
      <Header />

      <div className="fixed top-[97px] left-0 z-0 pointer-events-none hidden lg:block">
        <Image
          src="/images/top-left.svg"
          alt="Top-left decorative vector"
          width={150}
          height={150}
          className="opacity-50 w-auto h-auto"
          priority
        />
      </div>

      <div className="fixed top-[97px] right-0 z-0 pointer-events-none hidden lg:block">
        <Image
          src="/images/top-right.svg"
          alt="Top-right decorative vector"
          width={150}
          height={150}
          className="opacity-50 w-auto h-auto"
          priority
        />
      </div>

      <div
        className="relative flex flex-col lg:flex-row justify-evenly min-h-screen"
        style={{
          marginTop: "100px",
        }}
      >
        <div
          className="w-full lg:w-1/3 flex flex-col justify-start items-start px-4 lg:px-8"
          style={{ paddingTop: "80px", paddingBottom: "40px" }}
        >
          <div
            className="mb-8 text-left w-full"
            style={{
              opacity: 1,
            }}
          >
            <h1
              style={{
                fontFamily: "PP Supply Sans, Titillium Web",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "clamp(28px, 6vw, 48px)",
                lineHeight: "110%",
                letterSpacing: "0%",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              <span style={{ color: "#D73D80" }}>Choose your PFP.</span>
              <br />
              <span style={{ color: "#FDF2FF" }}>
                Select your avatar and mint your NFT.
              </span>
            </h1>
          </div>

          <div
            className="w-full text-left"
            style={{
              maxWidth: "400px",
              minHeight: "60px",
              transform: "rotate(0deg)",
              opacity: 1,
            }}
          >
            <p
              style={{
                fontFamily: "Titillium Web",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "clamp(14px, 3.5vw, 18px)",
                lineHeight: "140%",
                letterSpacing: "0%",
                color: "#B9A7C0",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              Minting a new generation of tokenized basket managers.
            </p>
          </div>
        </div>

        <div
          className="w-full lg:w-1/3 flex flex-col justify-center items-center px-4 lg:px-0"
          style={{
            height: "auto",
            minHeight: "auto",
            gap: "32px",
            transform: "rotate(0deg)",
            opacity: 1,
            paddingBottom: "50px",
            paddingTop: "40px",
          }}
        >
          <div
            className="text-center w-full max-w-md"
            style={{
              minHeight: "84px",
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
                fontSize: "clamp(24px, 6vw, 32px)",
                lineHeight: "1.2",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#ffffff",
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
                fontSize: "clamp(16px, 4vw, 20px)",
                lineHeight: "125%",
                letterSpacing: "0%",
                color: "#B199B5",
              }}
            >
              Select your avatar and mint your unique NFT
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-[-200px] bottom-0 z-0 pointer-events-none hidden lg:block">
              <Image
                src="/images/left.svg"
                alt="Left decorative vector"
                width={200}
                height={200}
                className="opacity-50 w-auto h-auto"
                priority
              />
            </div>

            <div
              style={{
                width: "100%",
                maxWidth: "368px",
                background: "#7861851A",
                border: "1px solid #786185",
                borderRadius: "0px",
                padding: "24px 32px",
                gap: "32px",
                transform: "rotate(0deg)",
                opacity: 1,
              }}
              className="mx-auto"
            >
              <AvatarMinter />
            </div>

            <div className="absolute right-[-200px] bottom-0 z-0 pointer-events-none hidden lg:block">
              <Image
                src="/images/right.svg"
                alt="Right decorative vector"
                width={200}
                height={200}
                className="opacity-50 w-auto h-auto"
                priority
              />
            </div>
          </div>
        </div>
        <div
          className="w-full lg:w-1/3 flex flex-col justify-start px-4 lg:px-8"
          style={{ paddingTop: "80px", paddingBottom: "40px" }}
        >
          <h2
            style={{
              fontFamily: "PP Supply Sans, Titillium Web, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "clamp(24px, 6vw, 32px)",
              lineHeight: "125%",
              letterSpacing: "0%",
              color: "#ffffff",
              marginBottom: "16px",
              maxWidth: "100%",
            }}
          >
            What is an Investment Wanker?
          </h2>
          <p
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "clamp(14px, 3.5vw, 18px)",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "#B9A7C0",
              marginBottom: "20px",
              maxWidth: "100%",
            }}
          >
            TradFi can keep the pinstripes, Investment Wanker is the new power
            suit in PFP form, and the NFT that pays you back.
          </p>
          <p
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "clamp(14px, 3.5vw, 18px)",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "#B9A7C0",
              marginBottom: "20px",
              maxWidth: "100%",
            }}
          >
            Introducing the genesis drop of a future generative collection — IW
            NFTs are more than collectibles. They're your ticket into BSKT Lab,
            your proof of status, and your stake in Alvara's growth
          </p>
          <p
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "clamp(14px, 3.5vw, 18px)",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "#B9A7C0",
              marginBottom: "20px",
              maxWidth: "100%",
            }}
          >
            Here's the deal:
          </p>
          <p
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "clamp(14px, 3.5vw, 18px)",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "#B9A7C0",
              marginBottom: "20px",
              maxWidth: "100%",
            }}
          >
            1️⃣ Mint your Investment Wanker NFT
          </p>
          <p
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "clamp(14px, 3.5vw, 18px)",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "#B9A7C0",
              marginBottom: "20px",
              maxWidth: "100%",
            }}
          >
            2️⃣ Set it as your X PFP
          </p>
          <p
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "clamp(14px, 3.5vw, 18px)",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "#B9A7C0",
              marginBottom: "20px",
              maxWidth: "100%",
            }}
          >
            3️⃣ Clock in and verify via the form
          </p>
          <p
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "clamp(14px, 3.5vw, 18px)",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "#B9A7C0",
              marginBottom: "20px",
              maxWidth: "100%",
            }}
          >
            BSKT Lab Beta: Pioneer Launch is live. When 721 verified wankers rep
            their pfps in the ultimate takeover, we'll throw the doors wide on
            BSKT Lab and head straight into the Legendary Basement Party.
          </p>
        </div>
      </div>

      {/* Typeform Section */}
      <div className="  w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3
              className="text-white text-2xl lg:text-3xl font-semibold mb-4"
              style={{
                fontFamily: "Titillium Web",
                fontWeight: 700,
                lineHeight: "125%",
              }}
            >
              Join the Alvara Office!
            </h3>
          </div>
          <div className="bg-white rounded-xl p-1 shadow-lg">
            <div data-tf-live="01K2HPGN3YEBFXJBY1XMZH58CM"></div>
          </div>
        </div>
      </div>

      {mintedNFTs.length > 0 && (
        <div className="mt-8 lg:mt-16 w-full px-4 sm:px-6 lg:px-8">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6 max-w-6xl mx-auto">
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

          {mintedNFTs.length >= maxMintsPerWallet && (
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

      <div className="mt-8 lg:mt-6 w-full relative z-10 pb-6 px-4 sm:px-6 lg:px-8">
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
              You own {totalNFTs} NFT{totalNFTs !== 1 ? "s" : ""}
            </p>

            <div className="flex flex-wrap justify-center gap-6 lg:gap-12 px-2 md:px-8">
              {ownedNFTs.map((nft, index) => (
                <div
                  key={`owned-${nft.tokenId}-${index}`}
                  className="relative bg-[#2A1F3B]/50 rounded-xl p-4 lg:p-6 border border-[#786185]/30 hover:border-[#D73D80]/50 transition-all duration-200 group"
                  style={{
                    minWidth: "280px",
                    maxWidth: "400px",
                    width: "100%",
                  }}
                >
                  <div
                    className="relative w-full mb-4"
                    style={{ height: "clamp(200px, 50vw, 280px)" }}
                  >
                    <Image
                      src={
                        nft.imageUrl ||
                        nft.metadata?.image ||
                        "/images/nfts/Basket-Beth.png"
                      }
                      alt={nft.name || `Alvara #${nft.tokenId}`}
                      fill
                      sizes="400px"
                      className="object-contain rounded-lg"
                    />

                    <button
                      onClick={() =>
                        shareOnX({
                          id: nft.tokenId.toString(),
                          number: nft.tokenId,
                          name: nft.name || `Alvara #${nft.tokenId}`,
                          description:
                            nft.metadata?.description ||
                            "A unique Alvara NFT from the collection",
                          price: 0.01,
                          image:
                            nft.imageUrl ||
                            nft.metadata?.image ||
                            "/images/nfts/Basket-Beth.png",
                        })
                      }
                      className="absolute top-4 right-4 bg-black/70 hover:bg-[#1DA1F2] p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                      title="Share on X"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-white"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="text-white text-lg font-semibold mb-1">
                      {nft.name || `Alvara #${nft.tokenId}`}
                    </p>
                    <p className="text-[#D8CDE2]/70 text-sm">
                      Token #{nft.tokenId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
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

      <div className="pt-32 pb-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <Image
            src="/images/banner.png"
            alt="Alvara NFT Banner"
            width={1200}
            height={400}
            className="w-full h-auto rounded-lg"
            priority
          />
        </div>
        <FAQ />
      </div>

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
