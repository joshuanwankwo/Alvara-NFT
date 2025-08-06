# Alvara NFT Metadata

This directory contains the metadata for the Alvara NFT collection, following [OpenSea metadata standards](https://docs.opensea.io/docs/metadata-standards).

## Collection Overview

The Alvara collection consists of 10 unique NFT designs, each with distinct themes and attributes:

| Design ID | Name               | Collection | Rarity    | Element    | Energy Level |
| --------- | ------------------ | ---------- | --------- | ---------- | ------------ |
| 1         | Alvara Genesis #1  | Genesis    | Legendary | Crystal    | 95           |
| 2         | Alvara Mystic #2   | Mystic     | Epic      | Cosmic     | 82           |
| 3         | Alvara Ethereal #3 | Ethereal   | Rare      | Wind       | 68           |
| 4         | Alvara Inferno #4  | Inferno    | Epic      | Fire       | 98           |
| 5         | Alvara Oceanic #5  | Oceanic    | Rare      | Water      | 76           |
| 6         | Alvara Terra #6    | Terra      | Uncommon  | Earth      | 72           |
| 7         | Alvara Void #7     | Void       | Legendary | Darkness   | 91           |
| 8         | Alvara Solar #8    | Solar      | Epic      | Light      | 94           |
| 9         | Alvara Nexus #9    | Nexus      | Mythic    | Unity      | 99           |
| 10        | Alvara Apex #10    | Apex       | Mythic    | Perfection | 100          |

## Rarity Distribution

- **Mythic**: 2 NFTs (20%)
- **Legendary**: 2 NFTs (20%)
- **Epic**: 3 NFTs (30%)
- **Rare**: 2 NFTs (20%)
- **Uncommon**: 1 NFT (10%)

## Metadata Structure

Each metadata file contains:
- **name**: Unique name for each NFT
- **description**: Rich description of the artwork
- **image**: URL to the NFT image
- **external_url**: Link to view the NFT details
- **attributes**: Array of traits including:
  - Collection type
  - Rarity level
  - Elemental theme
  - Color scheme
  - Energy level (numeric trait)
  - Special power (boost percentage)
  - Creation date
- **background_color**: Hex color for OpenSea display

## URLs Structure

- Metadata: `https://api.alvara-nft.com/metadata/{id}.json`
- Images: `https://api.alvara-nft.com/images/{id}.png`
- External: `https://alvara-nft.com/token/{id}`

## Next Steps

1. Create/obtain artwork for each design (1.png - 10.png)
2. Host metadata and images (IPFS, server, or CDN)
3. Deploy updated smart contract
4. Update smart contract base URI to point to hosted metadata