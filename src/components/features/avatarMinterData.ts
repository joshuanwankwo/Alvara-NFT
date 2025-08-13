export interface AlvaraNFT {
  id: string;
  number: number;
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
  background_color: string;
  animation_url: string;
  youtube_url: string;
  collection: {
    name: string;
    family: string;
  };
  properties: {
    files: Array<{ uri: string; type: string }>;
    category: string;
  };
}

export const alvaraNFTs: AlvaraNFT[] = [
  {
    id: "001",
    number: 1,
    name: "#1",
    description:
      "The basket manager who never misses a beat. Always diversified, always winning.",
    image:
      "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Basket-Beth.png",
    attributes: [
      {
        trait_type: "Character",
        value: "Basket Manager",
      },
      {
        trait_type: "Strategy",
        value: "Diversified",
      },
      {
        trait_type: "Risk Level",
        value: "Low",
      },
      {
        trait_type: "Experience",
        value: "Veteran",
      },
    ],
    background_color: "1D132E",
    animation_url: "",
    youtube_url: "",
    collection: {
      name: "Alvara Investment Wankers",
      family: "Alvara",
    },
    properties: {
      files: [
        {
          uri: "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Basket-Beth.png",
          type: "image/png",
        },
      ],
      category: "image",
    },
  },
  {
    id: "002",
    number: 2,
    name: "#2",
    description:
      "The ultimate degen who goes all-in on every trade. High risk, high reward mentality.",
    image:
      "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Degen-Derrick.png",
    attributes: [
      {
        trait_type: "Character",
        value: "Degen Trader",
      },
      {
        trait_type: "Strategy",
        value: "All-In",
      },
      {
        trait_type: "Risk Level",
        value: "Extreme",
      },
      {
        trait_type: "Experience",
        value: "Degen",
      },
    ],
    background_color: "1D132E",
    animation_url: "",
    youtube_url: "",
    collection: {
      name: "Alvara Investment Wankers",
      family: "Alvara",
    },
    properties: {
      files: [
        {
          uri: "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Degen-Derrick.png",
          type: "image/png",
        },
      ],
      category: "image",
    },
  },
  {
    id: "003",
    number: 3,
    name: "#3",
    description:
      "The FOMO master who buys at the top and sells at the bottom. Classic FOMO behavior.",
    image:
      "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Freddy-fomo.png",
    attributes: [
      {
        trait_type: "Character",
        value: "FOMO Trader",
      },
      {
        trait_type: "Strategy",
        value: "FOMO",
      },
      {
        trait_type: "Risk Level",
        value: "High",
      },
      {
        trait_type: "Experience",
        value: "FOMO Expert",
      },
    ],
    background_color: "1D132E",
    animation_url: "",
    youtube_url: "",
    collection: {
      name: "Alvara Investment Wankers",
      family: "Alvara",
    },
    properties: {
      files: [
        {
          uri: "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Freddy-fomo.png",
          type: "image/png",
        },
      ],
      category: "image",
    },
  },
  {
    id: "004",
    number: 4,
    name: "#4",
    description:
      "The profit queen who always takes her gains. Knows when to exit and secure profits.",
    image:
      "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Gloria-Gains.png",
    attributes: [
      {
        trait_type: "Character",
        value: "Profit Taker",
      },
      {
        trait_type: "Strategy",
        value: "Take Profits",
      },
      {
        trait_type: "Risk Level",
        value: "Medium",
      },
      {
        trait_type: "Experience",
        value: "Profit Master",
      },
    ],
    background_color: "1D132E",
    animation_url: "",
    youtube_url: "",
    collection: {
      name: "Alvara Investment Wankers",
      family: "Alvara",
    },
    properties: {
      files: [
        {
          uri: "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Gloria-Gains.png",
          type: "image/png",
        },
      ],
      category: "image",
    },
  },
  {
    id: "005",
    number: 5,
    name: "#5",
    description:
      "The diamond hands hodler who never sells. HODL through thick and thin.",
    image:
      "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Henry-Hodl.png",
    attributes: [
      {
        trait_type: "Character",
        value: "HODLer",
      },
      {
        trait_type: "Strategy",
        value: "HODL",
      },
      {
        trait_type: "Risk Level",
        value: "Medium",
      },
      {
        trait_type: "Experience",
        value: "Diamond Hands",
      },
    ],
    background_color: "1D132E",
    animation_url: "",
    youtube_url: "",
    collection: {
      name: "Alvara Investment Wankers",
      family: "Alvara",
    },
    properties: {
      files: [
        {
          uri: "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Henry-Hodl.png",
          type: "image/png",
        },
      ],
      category: "image",
    },
  },
  {
    id: "006",
    number: 6,
    name: "#6",
    description:
      "The technical analyst who reads every candle. Charts and patterns are her life.",
    image:
      "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Kate-Candle.png",
    attributes: [
      {
        trait_type: "Character",
        value: "Technical Analyst",
      },
      {
        trait_type: "Strategy",
        value: "Technical Analysis",
      },
      {
        trait_type: "Risk Level",
        value: "Medium",
      },
      {
        trait_type: "Experience",
        value: "Chart Master",
      },
    ],
    background_color: "1D132E",
    animation_url: "",
    youtube_url: "",
    collection: {
      name: "Alvara Investment Wankers",
      family: "Alvara",
    },
    properties: {
      files: [
        {
          uri: "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Kate-Candle.png",
          type: "image/png",
        },
      ],
      category: "image",
    },
  },
  {
    id: "007",
    number: 7,
    name: "#7",
    description:
      "The leverage king who trades with maximum leverage. 100x or nothing.",
    image:
      "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Leroy-leverage.png",
    attributes: [
      {
        trait_type: "Character",
        value: "Leverage Trader",
      },
      {
        trait_type: "Strategy",
        value: "Maximum Leverage",
      },
      {
        trait_type: "Risk Level",
        value: "Extreme",
      },
      {
        trait_type: "Experience",
        value: "Leverage King",
      },
    ],
    background_color: "1D132E",
    animation_url: "",
    youtube_url: "",
    collection: {
      name: "Alvara Investment Wankers",
      family: "Alvara",
    },
    properties: {
      files: [
        {
          uri: "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Leroy-leverage.png",
          type: "image/png",
        },
      ],
      category: "image",
    },
  },
  {
    id: "008",
    number: 8,
    name: "#8",
    description:
      "The workaholic trader who never sleeps. 24/7 market monitoring.",
    image:
      "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Max-Effort.png",
    attributes: [
      {
        trait_type: "Character",
        value: "Workaholic",
      },
      {
        trait_type: "Strategy",
        value: "24/7 Trading",
      },
      {
        trait_type: "Risk Level",
        value: "High",
      },
      {
        trait_type: "Experience",
        value: "No Sleep",
      },
    ],
    background_color: "1D132E",
    animation_url: "",
    youtube_url: "",
    collection: {
      name: "Alvara Investment Wankers",
      family: "Alvara",
    },
    properties: {
      files: [
        {
          uri: "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Max-Effort.png",
          type: "image/png",
        },
      ],
      category: "image",
    },
  },
  {
    id: "009",
    number: 9,
    name: "#9",
    description:
      "The DeFi queen who swaps everything. Always chasing the best yields.",
    image:
      "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Sally-Swaps.png",
    attributes: [
      {
        trait_type: "Character",
        value: "DeFi Trader",
      },
      {
        trait_type: "Strategy",
        value: "Yield Farming",
      },
      {
        trait_type: "Risk Level",
        value: "Medium",
      },
      {
        trait_type: "Experience",
        value: "DeFi Expert",
      },
    ],
    background_color: "1D132E",
    animation_url: "",
    youtube_url: "",
    collection: {
      name: "Alvara Investment Wankers",
      family: "Alvara",
    },
    properties: {
      files: [
        {
          uri: "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/Sally-Swaps.png",
          type: "image/png",
        },
      ],
      category: "image",
    },
  },
  {
    id: "010",
    number: 10,
    name: "#10",
    description:
      "The traditional banker who's late to crypto. Still learning the ropes.",
    image:
      "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/William-Banker.png",
    attributes: [
      {
        trait_type: "Character",
        value: "Traditional Banker",
      },
      {
        trait_type: "Strategy",
        value: "Conservative",
      },
      {
        trait_type: "Risk Level",
        value: "Low",
      },
      {
        trait_type: "Experience",
        value: "Crypto Newbie",
      },
    ],
    background_color: "1D132E",
    animation_url: "",
    youtube_url: "",
    collection: {
      name: "Alvara Investment Wankers",
      family: "Alvara",
    },
    properties: {
      files: [
        {
          uri: "https://yellow-imperial-wasp-317.mypinata.cloud/ipfs/bafybeibtxhw6zer4i4ehpckmfhoh7qyvr6ggshpqadx5urm7cajcyfxts4/William-Banker.png",
          type: "image/png",
        },
      ],
      category: "image",
    },
  },
];
