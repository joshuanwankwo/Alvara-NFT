import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Header, AvatarMinter } from "@/components";
import { FAQ } from "@/components/ui/FAQ";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative overflow-x-hidden min-h-screen">
      <Header />

      {/* Top-left Vector */}
      <div className="fixed top-[97px] left-0 z-0 pointer-events-none">
        <Image
          src="/images/top-left.svg"
          alt="Top-left decorative vector"
          width={300}
          height={300}
          className="opacity-50"
          priority
        />
      </div>

      {/* Top-right Vector */}
      <div className="fixed top-[97px] right-0 z-0 pointer-events-none">
        <Image
          src="/images/top-right.svg"
          alt="Top-right decorative vector"
          width={300}
          height={300}
          className="opacity-50"
          priority
        />
      </div>

      <div className="relative pt-[97px]" style={{ minHeight: 'calc(100vh - 97px)', paddingBottom: '100px', overflow: 'visible' }}>
        {/* Left Side - Marketing Text */}
        <div className="absolute left-0 top-0 w-1/2 h-full flex flex-col justify-center pl-56" style={{ paddingTop: '180px' }}>
          {/* Headline Section */}
          <div 
            className="mb-8"
            style={{
              width: '356px',
              height: '160px',
              top: '303px',
              left: '108px',
              gap: '10px',
              transform: 'rotate(0deg)',
              opacity: 1
            }}
          >
            <h1 
              style={{
                fontFamily: 'PP Supply Sans, Titillium Web',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '64px',
                lineHeight: '125%',
                letterSpacing: '0%'
              }}
            >
              <span style={{ color: '#D73D80' }}>Mint NFTs.</span><br />
              <span style={{ color: '#FDF2FF' }}>Mint Legacy.</span>
            </h1>
          </div>

          {/* Sub-heading Section */}
          <div 
            className="max-w-md"
            style={{
              width: '306px',
              height: '90px',
              top: '478px',
              left: '108px',
              gap: '10px',
              transform: 'rotate(0deg)',
              opacity: 1
            }}
          >
            <p 
              style={{
                fontFamily: 'Titillium Web',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '20px',
                lineHeight: '150%',
                letterSpacing: '0%',
                color: '#B9A7C0'
              }}
            >
              Minting a new generation of tokenised basket managers.
            </p>
          </div>
        </div>

        {/* Right Side - NFT Interface */}
        <div 
          className="absolute right-0 top-0 w-1/2 flex flex-col justify-center items-center"
          style={{
            width: '373px',
            height: 'auto',
            minHeight: '750px',
            top: '120px',
            left: '750px',
            gap: '32px',
            transform: 'rotate(0deg)',
            opacity: 1,
            paddingBottom: '50px'
          }}
        >
          {/* Text Section */}
          <div 
            className="text-center mb-8"
            style={{
              width: '373px',
              height: '84px',
              gap: '10px',
              transform: 'rotate(0deg)',
              opacity: 1
            }}
          >
            <h2 
              style={{
                fontFamily: 'Titillium Web',
                fontWeight: 600,
                fontStyle: 'normal',
                fontSize: '32px',
                lineHeight: '48.59px',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#B9A7C0',
                marginBottom: '10px'
              }}
            >
              Choose your avatar
            </h2>
            <p 
              style={{
                fontFamily: 'Titillium Web',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '20px',
                lineHeight: '125%',
                letterSpacing: '0%',
                color: '#B199B5'
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
                width: '368px',
                height: '608px',
                background: '#7861851A',
                border: '1px solid #786185',
                borderRadius: '0px',
                padding: '32px 56px 32px 56px',
                gap: '32px',
                transform: 'rotate(0deg)',
                opacity: 1
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

          {/* Right Side Text */}
          <div className="absolute right-[-500px] top-[100px] w-80 flex flex-col justify-center">
            <h2 
              style={{
                fontFamily: 'PP Supply Sans, Titillium Web, sans-serif',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '32px',
                lineHeight: '125%',
                letterSpacing: '0%',
                color: '#D73D80',
                marginBottom: '16px'
              }}
            >
              Who is an Investment Wanker?
            </h2>
            <p 
              style={{
                fontFamily: 'Supply Sans',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '16px',
                lineHeight: '150%',
                letterSpacing: '0%',
                color: '#B9A7C0',
                marginBottom: '12px'
              }}
            >
              A satire on TradFi bros who missed the memo.
            </p>
            <p 
              style={{
                fontFamily: 'Titillium Web',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '16px',
                lineHeight: '150%',
                letterSpacing: '0%',
                color: '#B9A7C0',
                marginBottom: '12px'
              }}
            >
              But also, a real yield-generating asset that gives you:
            </p>
            <ul 
              style={{
                fontFamily: 'Titillium Web',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '16px',
                lineHeight: '150%',
                letterSpacing: '0%',
                color: '#B9A7C0',
                marginBottom: '12px',
                paddingLeft: '20px'
              }}
            >
              <li>• 6 months of ALVA staking rewards distributed monthly</li>
              <li>• veALVA voting power + 10% revenue share</li>
              <li>• Final ALVA airdrop at the end</li>
            </ul>
            <p 
              style={{
                fontFamily: 'Titillium Web',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '16px',
                lineHeight: '150%',
                letterSpacing: '0%',
                color: '#B9A7C0',
                marginBottom: '12px'
              }}
            >
              7 days limited NFT mint. Either you are in or out.
            </p>
            
            <p 
              style={{
                fontFamily: 'Titillium Web',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '16px',
                lineHeight: '150%',
                letterSpacing: '0%',
                color: '#B9A7C0'
              }}
            >
              Holding it = symbolically and financially part of the future of onchain capital formation.
            </p>
          </div>
        </div>
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
