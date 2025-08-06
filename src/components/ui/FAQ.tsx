"use client";

import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="mb-3 sm:mb-4 lg:mb-6 p-4 sm:p-5 lg:p-6 rounded-xl"
      style={{
        background: "#7861851A",
        border: "1px solid #786185",
        fontFamily: "Titillium Web",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-start sm:items-center hover:text-[#D8CDE2] transition-colors duration-200 gap-4"
        style={{ fontFamily: "Titillium Web" }}
      >
        <span
          className="text-sm sm:text-base lg:text-lg font-semibold pr-2 flex-1"
          style={{
            fontFamily: "Titillium Web",
            fontWeight: 600,
            fontStyle: "normal",
            lineHeight: "125%",
            letterSpacing: "0%",
            color: "#D8CDE2",
          }}
        >
          {question}
        </span>
        <span
          className={`text-lg sm:text-xl lg:text-2xl font-semibold flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          style={{
            fontFamily: "Titillium Web",
            fontWeight: 600,
            fontStyle: "normal",
            lineHeight: "125%",
            letterSpacing: "0%",
            color: "#D8CDE2",
          }}
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div className="pt-3 sm:pt-4">
          <p
            className="text-sm sm:text-base lg:text-lg leading-relaxed"
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 400,
              fontStyle: "normal",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "#B199B5",
            }}
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export function FAQ() {
  const faqData = [
    {
      question: "How many NFTs can I mint?",
      answer: "You can mint up to 3 NFTs per wallet.",
    },
    {
      question: "What perks do I get with my NFT?",
      answer:
        "Each NFT comes with: A 6-month yield stream from staked ALVA. Rewards disbursed from the veALVA staking pool (ve means staked). Eligibility for ALVA airdrop at the end of the lock period. Upside from milestone-based unlocks (more below).",
    },
    {
      question: "How much does it cost?",
      answer: "Each NFT is priced at 0.01 ETH but you can get a 50% discount if you stake a minumium of 150 $ALVA.",
    },
    {
      question: "Can I sell my NFT?",
      answer:
        "Yes, NFTs are transferable & tradable on secondary markets. Perks like staking rewards, veALVA, and the final airdrop go to whoever holds the NFT at the time of each distribution.",
    },
    {
      question: "What happens to the ETH raised from NFT minting?",
      answer:
        "100% of the ETH raised is used to buy back ALVA from the market. That ALVA is: Staked for 6 months on behalf of NFT holders. Earns yield monthly, which is distributed to holders. Airdropped back to holders in liquid ALVA at the end of the staking period.",
    },
    {
      question: "What is veALVA and what does it do?",
      answer:
        "veALVA is a staked version of ALVA that earns protocol revenue. Your NFT gives you veALVA during the lock period, letting you earn from the SRV pool.",
    },
    {
      question: "Is there a lock period?",
      answer: "Yes. The default lock period is 6 months",
    },
  ];

  return (
    <section
      className="bg-[#1D132E]/50 backdrop-blur-[40px] py-8 sm:py-12 lg:py-16"
      style={{ fontFamily: "Titillium Web" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2 sm:mb-4"
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 600,
              fontStyle: "normal",
              lineHeight: "125%",
              letterSpacing: "0%",
              color: "#D8CDE2",
            }}
          >
            Frequently asked questions
          </h2>
          <p
            className="text-base sm:text-lg lg:text-xl"
            style={{
              fontFamily: "Titillium Web",
              fontWeight: 400,
              fontStyle: "normal",
              lineHeight: "125%",
              letterSpacing: "0%",
              color: "#B199B5",
            }}
          >
            Find quick answers about alvara NFTs
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
