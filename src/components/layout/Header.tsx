"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { Wallet } from "lucide-react";
import Image from "next/image";
import logo from "../../../public/images/logo.png";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-[97px] bg-[#1D132E]/50 backdrop-blur-[40px] border-b border-[#C9B2CD]/25 flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[108px] py-4 sm:py-6">
      {/* Logo */}
      <Link
        href="#home"
        className="flex items-center hover:opacity-90 transition-opacity duration-200"
      >
        <div className="flex items-center">
          <Image
            src={logo}
            alt="Logo"
            width={120}
            height={40}
            className="h-5 sm:h-6 md:h-8 w-auto"
            priority
          />
        </div>
      </Link>

      {/* Connect Wallet Button */}
      <div className="flex items-center">
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className="w-auto min-w-[120px] sm:min-w-[140px] md:min-w-[178px] h-[40px] sm:h-[45px] md:h-[49px] bg-gradient-to-r from-[#FC75AF] to-[#D73D80] hover:opacity-90 text-white font-medium rounded-xl px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 md:gap-2.5 text-xs sm:text-sm md:text-base"
                      >
                        <Wallet className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        <span className="hidden sm:inline">Connect</span>
                        <span className="sm:hidden">Connect</span>
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="w-auto min-w-[120px] sm:min-w-[140px] md:min-w-[178px] h-[40px] sm:h-[45px] md:h-[49px] bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 transition-all duration-200 flex items-center justify-center text-xs sm:text-sm md:text-base"
                      >
                        <span className="hidden sm:inline">Wrong network</span>
                        <span className="sm:hidden">Wrong net</span>
                      </button>
                    );
                  }

                  return (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={openChainModal}
                        className="bg-[#13061F]/80 hover:bg-[#13061F] text-white font-medium py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                        type="button"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: "hidden",
                              marginRight: 2,
                            }}
                            className="sm:w-4 sm:h-4 sm:mr-1"
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                                className="sm:w-4 sm:h-4"
                              />
                            )}
                          </div>
                        )}
                        <span className="hidden sm:inline">{chain.name}</span>
                        <span className="sm:hidden">
                          {chain.name?.split(" ")[0]}
                        </span>
                      </button>

                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="w-auto min-w-[120px] sm:min-w-[140px] md:min-w-[178px] h-[40px] sm:h-[45px] md:h-[49px] bg-gradient-to-r from-[#FC75AF] to-[#D73D80] hover:opacity-90 text-white font-medium rounded-xl px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 transition-all duration-200 flex items-center justify-center text-xs sm:text-sm md:text-base"
                      >
                        <span className="hidden sm:inline">
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ""}
                        </span>
                        <span className="sm:hidden">
                          {account.displayName?.slice(0, 6)}...
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ""}
                        </span>
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </header>
  );
}
