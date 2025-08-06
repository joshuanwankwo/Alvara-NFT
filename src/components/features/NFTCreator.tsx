"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Coins,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import { NFTForm } from "./NFTForm";
import { NFTPreview } from "./NFTPreview";
import { MintingModal } from "../modals";

interface NFTData {
  name: string;
  description: string;
  image: File | null;
  imagePreview: string;
  attributes: Array<{ trait_type: string; value: string }>;
  external_url: string;
  collection: string;
}

export function NFTCreator() {
  const { isConnected } = useAccount();
  const [nftData, setNftData] = useState<NFTData>({
    name: "",
    description: "",
    image: null,
    imagePreview: "",
    attributes: [],
    external_url: "",
    collection: "",
  });
  const [isMinting, setIsMinting] = useState(false);
  const [mintingStep, setMintingStep] = useState(0);
  const [showMintingModal, setShowMintingModal] = useState(false);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setNftData((prev) => ({
        ...prev,
        image: file,
        imagePreview: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleImageUpload(file);
      }
    },
    [handleImageUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleMint = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (!nftData.name || !nftData.image) {
      alert("Please fill in all required fields and upload an image");
      return;
    }

    setIsMinting(true);
    setShowMintingModal(true);

    // Simulate minting process
    for (let i = 0; i < 4; i++) {
      setMintingStep(i);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    setIsMinting(false);
    setMintingStep(4);

    // Reset after success
    setTimeout(() => {
      setShowMintingModal(false);
      setMintingStep(0);
      setNftData({
        name: "",
        description: "",
        image: null,
        imagePreview: "",
        attributes: [],
        external_url: "",
        collection: "",
      });
    }, 2000);
  };

  return (
    <section id="create" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Create Your NFT</span>
          </h2>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            Upload your artwork, add metadata, and mint your unique digital
            asset on the blockchain
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Image Upload */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-primary-400" />
                Upload Image
              </h3>

              {!nftData.imagePreview ? (
                <div
                  className="border-2 border-dashed border-dark-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-dark-400" />
                  <p className="text-dark-300 mb-2">
                    Drag and drop your image here
                  </p>
                  <p className="text-dark-400 text-sm">or click to browse</p>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={nftData.imagePreview}
                    alt="NFT Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={() =>
                      setNftData((prev) => ({
                        ...prev,
                        image: null,
                        imagePreview: "",
                      }))
                    }
                    className="absolute top-2 right-2 w-8 h-8 bg-dark-800/80 rounded-full flex items-center justify-center hover:bg-dark-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* NFT Form */}
            <NFTForm nftData={nftData} setNftData={setNftData} />

            {/* Mint Button */}
            <button
              onClick={handleMint}
              disabled={!isConnected || !nftData.name || !nftData.image}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Coins className="w-5 h-5" />
              <span>Mint NFT</span>
              <Sparkles className="w-5 h-5" />
            </button>

            {!isConnected && (
              <p className="text-center text-dark-400 text-sm">
                Connect your wallet to start minting
              </p>
            )}
          </motion.div>

          {/* Right Column - Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24"
          >
            <NFTPreview nftData={nftData} />
          </motion.div>
        </div>
      </div>

      {/* Minting Modal */}
      <MintingModal
        isOpen={showMintingModal}
        step={mintingStep}
        isMinting={isMinting}
        nftData={nftData}
      />
    </section>
  );
}
