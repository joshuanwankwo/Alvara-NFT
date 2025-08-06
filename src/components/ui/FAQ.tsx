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
      style={{
        background: '#7861851A',
        border: '1px solid #786185',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '16px',
        fontFamily: 'Titillium Web'
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center hover:text-[#D8CDE2] transition-colors duration-200"
        style={{ fontFamily: 'Titillium Web' }}
      >
        <span 
          style={{
            fontFamily: 'Titillium Web',
            fontWeight: 600,
            fontStyle: 'normal',
            fontSize: '18px',
            lineHeight: '125%',
            letterSpacing: '0%',
            color: '#D8CDE2'
          }}
        >
          {question}
        </span>
        <span 
          style={{
            fontFamily: 'Titillium Web',
            fontWeight: 600,
            fontStyle: 'normal',
            fontSize: '24px',
            lineHeight: '125%',
            letterSpacing: '0%',
            color: '#D8CDE2',
            transition: 'transform duration-200'
          }}
          className={isOpen ? 'transform rotate-180' : ''}
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div className="pt-4">
          <p 
            style={{
              fontFamily: 'Titillium Web',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: '16px',
              lineHeight: '150%',
              letterSpacing: '0%',
              color: '#B199B5'
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
      answer: "You can mint up to 3 NFTs per wallet."
    },
    {
      question: "What perks do I get with my NFT?",
      answer: "Each NFT comes with: A 6-month yield stream from staked ALVA. Rewards disbursed from the veALVA staking pool (ve means staked). Eligibility for ALVA airdrop at the end of the lock period. Upside from milestone-based unlocks (more below)."
    },
    {
      question: "How much does it cost?",
      answer: "Each NFT is priced at 0.01 ETH."
    },
    {
      question: "Can I sell my NFT?",
      answer: "Yes, NFTs are transferable & tradable on secondary markets. Perks like staking rewards, veALVA, and the final airdrop go to whoever holds the NFT at the time of each distribution."
    },
    {
      question: "What happens to the ETH raised from NFT minting?",
      answer: "100% of the ETH raised is used to buy back ALVA from the market. That ALVA is: Staked for 6 months on behalf of NFT holders. Earns yield monthly, which is distributed to holders. Airdropped back to holders in liquid ALVA at the end of the staking period."
    },
    {
      question: "What is veALVA and what does it do?",
      answer: "veALVA is a staked version of ALVA that earns protocol revenue. Your NFT gives you veALVA during the lock period, letting you earn from the SRV pool."
    },
    {
      question: "Is there a lock period?",
      answer: "Yes. The default lock period is 6 months"
    }
  ];

  return (
    <section className="bg-[#1D132E]/50 backdrop-blur-[40px] py-12" style={{ fontFamily: 'Titillium Web' }}>
      <div className="max-w-4xl ml-auto mr-[500px] px-6">
        <div className="text-center mb-12">
          <h2 
            style={{
              fontFamily: 'Titillium Web',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: '32px',
              lineHeight: '125%',
              letterSpacing: '0%',
              color: '#D8CDE2',
              marginBottom: '8px'
            }}
          >
            Frequently asked questions
          </h2>
          <p 
            style={{
              fontFamily: 'Titillium Web',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: '18px',
              lineHeight: '125%',
              letterSpacing: '0%',
              color: '#B199B5'
            }}
          >
            Find quick answers about alvara NFTs
          </p>
        </div>
        <div>
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