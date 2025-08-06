"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { Wallet } from "lucide-react";
import Image from "next/image";
import logo from "../../../public/images/logo.png";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-[97px] bg-[#1D132E]/50 backdrop-blur-[40px] border-b border-[#C9B2CD]/25 flex justify-between items-center px-[108px] py-6">
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
            className="h-6 md:h-8 w-auto"
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
                        className="w-[178px] h-[49px] bg-gradient-to-r from-[#FC75AF] to-[#D73D80] hover:opacity-90 text-white font-medium rounded-xl px-6 py-3 transition-all duration-200 flex items-center justify-center gap-2.5"
                        style={{
                          paddingTop: '12px',
                          paddingRight: '24px',
                          paddingBottom: '12px',
                          paddingLeft: '24px',
                          gap: '10px',
                          borderRadius: '12px',
                          opacity: 1
                        }}
                      >
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="w-[178px] h-[49px] bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl px-6 py-3 transition-all duration-200 flex items-center justify-center"
                        style={{
                          paddingTop: '12px',
                          paddingRight: '24px',
                          paddingBottom: '12px',
                          paddingLeft: '24px',
                          gap: '10px',
                          borderRadius: '12px',
                          opacity: 1
                        }}
                      >
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={openChainModal}
                        className="bg-[#13061F]/80 hover:bg-[#13061F] text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 flex items-center gap-2"
                        type="button"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 16,
                              height: 16,
                              borderRadius: 999,
                              overflow: "hidden",
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{ width: 16, height: 16 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button>

                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="w-[178px] h-[49px] bg-gradient-to-r from-[#FC75AF] to-[#D73D80] hover:opacity-90 text-white font-medium rounded-xl px-6 py-3 transition-all duration-200 flex items-center justify-center"
                        style={{
                          paddingTop: '12px',
                          paddingRight: '24px',
                          paddingBottom: '12px',
                          paddingLeft: '24px',
                          gap: '10px',
                          borderRadius: '12px',
                          opacity: 1
                        }}
                      >
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ""}
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
