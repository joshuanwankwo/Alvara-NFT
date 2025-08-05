"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAccount } from "wagmi";
import { Notification } from "../ui/Notification";
import Image, { StaticImageData } from "next/image";
import nftImage from "../../../public/images/nft.png";
import rightImage from "../../../public/images/right.png";
import vectorImage from "../../../public/images/Vector.png";

interface AlvaraNFT {
  id: string;
  number: number;
  name: string;
  description: string;
  price: number;
  image: StaticImageData;
}

const alvaraNFTs = [
  {
    id: "001",
    number: 1,
    name: "Radiant Alvara #001",
    description:
      "This is a unique Alvara NFT. Its rarity is unmatched, and its brilliance is captured forever on the blockchain. A true digital gem.",
    price: 0.01,
    image: nftImage,
  },
  {
    id: "002",
    number: 2,
    name: "Radiant Alvara #002",
    description:
      "A rare diamond with exceptional clarity and brilliance. Each facet reflects the future of digital art and blockchain technology.",
    price: 0.01,
    image: nftImage, // Using same image for now, can be replaced with different images
  },
  {
    id: "003",
    number: 3,
    name: "Radiant Alvara #003",
    description:
      "The perfect combination of rarity and beauty. This diamond represents the pinnacle of digital collectibles and NFT innovation.",
    price: 0.01,
    image: nftImage, // Using same image for now, can be replaced with different images
  },
];

export function AvatarMinter() {
  const { isConnected } = useAccount();
  const [currentNFTIndex, setCurrentNFTIndex] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    title: string;
    message?: string;
  } | null>(null);
  const [mintedNFTs, setMintedNFTs] = useState<AlvaraNFT[]>([]);

  const currentNFT = alvaraNFTs[currentNFTIndex];

  const nextNFT = () => {
    setCurrentNFTIndex((prev) => (prev + 1) % alvaraNFTs.length);
  };

  const prevNFT = () => {
    setCurrentNFTIndex(
      (prev) => (prev - 1 + alvaraNFTs.length) % alvaraNFTs.length
    );
  };

  const selectNFT = (index: number) => {
    setCurrentNFTIndex(index);
  };

  const handleMint = async () => {
    if (!isConnected) return;

    setIsMinting(true);
    setNotification(null);

    setTimeout(() => {
      setIsMinting(false);
      const isSuccess = Math.random() > 0.3;

      if (isSuccess) {
        const newMintedNFT = {
          ...currentNFT,
          id: `${currentNFT.id}-${Date.now()}`,
        };
        setMintedNFTs((prev) => [...prev, newMintedNFT]);

        setNotification({
          type: "success",
          title: "Transaction Confirmed!",
          message: "Successfully minted your Alvara NFT",
        });
      } else {
        setNotification({
          type: "error",
          title: "Transaction Failed",
          message: "You rejected the transaction in your wallet.",
        });
      }
    }, 3000);
  };

  const isMintDisabled = !isConnected || isMinting;

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Avatar Display */}
      <div className="flex items-center justify-center">
        <div 
          style={{
            width: '250px',
            height: '250px',
            background: '#FDF2FF',
            border: '0.67px solid #786185',
            padding: '8.02px',
            gap: '21.39px',
            transform: 'rotate(0deg)',
            opacity: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            className="relative"
            style={{
              width: '100%',
              height: '100%'
            }}
          >
            <Image
              src={currentNFT.image}
              alt={`Avatar ${currentNFT.number}`}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Carousel Dots */}
      <div className="flex items-center justify-center gap-1.5 mb-2">
        {alvaraNFTs.map((_, index) => (
          <button
            key={index}
            onClick={() => selectNFT(index)}
            className="transition-all duration-200"
            style={{
              width: index === currentNFTIndex ? '8px' : '6px',
              height: index === currentNFTIndex ? '8px' : '6px',
              borderRadius: '50%',
              background: index === currentNFTIndex ? '#D73D80' : '#B199B5',
              border: 'none',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>

      {/* Navigation and Status */}
      <div 
        className="flex flex-col space-y-3"
        style={{
          width: '212px',
          height: '121px',
          gap: '32px',
          transform: 'rotate(0deg)',
          opacity: 1
        }}
      >
        {/* Arrow Controls and Text Box */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevNFT}
            className="flex items-center justify-center transition-colors"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '100px',
              border: '2px solid #786185',
              background: '#D8CDE240'
            }}
          >
            <ChevronLeft className="w-5 h-5" style={{ color: '#FFFFFF' }} />
          </button>
          
          <div 
            className="flex items-center justify-center"
            style={{
              width: '92px',
              height: '44px',
              background: '#D8CDE240',
              border: '2px solid #786185',
              borderRadius: '12px',
              padding: '12px 24px'
            }}
          >
            <span className="text-[#D8CDE2] font-medium">MAN{currentNFT.number}</span>
          </div>
          
          <button
            onClick={nextNFT}
            className="flex items-center justify-center transition-colors"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '100px',
              border: '2px solid #786185',
              background: '#D8CDE240'
            }}
          >
            <ChevronRight className="w-5 h-5" style={{ color: '#FFFFFF' }} />
          </button>
        </div>

        {/* Minting Status */}
        <div 
          className="text-center flex items-center justify-center"
          style={{
            width: '139px',
            height: '45px',
            background: '#D8CDE240',
            border: '2px solid #786185',
            borderRadius: '16px',
            padding: '10px 24px',
            margin: '0 auto',
            marginBottom: '16px'
          }}
        >
          <span 
            style={{
              fontFamily: 'Titillium Web',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: '16px',
              lineHeight: '125%',
              letterSpacing: '0%',
              color: '#B199B5',
              whiteSpace: 'nowrap'
            }}
          >
            Minted: <span style={{ fontWeight: 'bold', color: '#FDF2FF' }}>{mintedNFTs.length}</span> / 3
          </span>
        </div>
      </div>

      {/* Mint Button and Text Group */}
      <div 
        style={{
          width: '256px',
          height: '109px',
          gap: '16px',
          transform: 'rotate(0deg)',
          opacity: 1
        }}
      >
        {/* Mint Button */}
        <button
          onClick={handleMint}
          disabled={isMintDisabled}
          style={{
            width: '256px',
            height: '49px',
            background: 'linear-gradient(249.09deg, #FC75AF -9.81%, #D73D80 110.19%)',
            borderRadius: '12px',
            padding: '12px 24px',
            border: 'none',
            cursor: isMintDisabled ? 'not-allowed' : 'pointer',
            transition: 'all duration-200',
            margin: '0 auto',
            display: 'block',
            marginBottom: '24px'
          }}
          className="text-white font-bold disabled:opacity-50"
        >
          {isMinting ? "MINTING..." : "Mint Now"}
        </button>

        {/* Text Group */}
        <div 
          className="text-center space-y-2"
          style={{
            width: '212px',
            gap: '8px',
            transform: 'rotate(0deg)',
            opacity: 1,
            marginLeft: '22px',
            marginBottom: '40px'
          }}
        >
          <div 
            style={{
              fontFamily: 'Titillium Web',
              fontWeight: 600,
              fontStyle: 'SemiBold',
              fontSize: '16px',
              lineHeight: '18px',
              letterSpacing: '0%',
              color: '#D73D80'
            }}
          >
            PRICED AT 0.01 ETH
          </div>
          <div 
            style={{
              fontFamily: 'Titillium Web',
              fontWeight: 400,
              fontStyle: 'Regular',
              fontSize: '14px',
              lineHeight: '18px',
              letterSpacing: '0%',
              color: '#B199B5'
            }}
          >
            Connect your wallet to start minting
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={closeNotification}
        />
      )}
    </div>
  );
}
