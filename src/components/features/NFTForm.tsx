'use client'

import { useState } from 'react'
import { FileText, Plus, X, Tag } from 'lucide-react'

interface NFTData {
  name: string
  description: string
  image: File | null
  imagePreview: string
  attributes: Array<{ trait_type: string; value: string }>
  external_url: string
  collection: string
}

interface NFTFormProps {
  nftData: NFTData
  setNftData: React.Dispatch<React.SetStateAction<NFTData>>
}

export function NFTForm({ nftData, setNftData }: NFTFormProps) {
  const [newAttribute, setNewAttribute] = useState({ trait_type: '', value: '' })

  const addAttribute = () => {
    if (newAttribute.trait_type && newAttribute.value) {
      setNftData(prev => ({
        ...prev,
        attributes: [...prev.attributes, newAttribute]
      }))
      setNewAttribute({ trait_type: '', value: '' })
    }
  }

  const removeAttribute = (index: number) => {
    setNftData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }))
  }

  const updateAttribute = (index: number, field: 'trait_type' | 'value', value: string) => {
    setNftData(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      )
    }))
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-primary-400" />
        NFT Metadata
      </h3>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Name *
          </label>
          <input
            type="text"
            value={nftData.name}
            onChange={(e) => setNftData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter NFT name"
            className="input-field w-full"
            maxLength={50}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Description
          </label>
          <textarea
            value={nftData.description}
            onChange={(e) => setNftData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your NFT"
            rows={3}
            className="input-field w-full resize-none"
            maxLength={500}
          />
          <p className="text-xs text-dark-400 mt-1">
            {nftData.description.length}/500 characters
          </p>
        </div>

        {/* Collection */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Collection
          </label>
          <input
            type="text"
            value={nftData.collection}
            onChange={(e) => setNftData(prev => ({ ...prev, collection: e.target.value }))}
            placeholder="Collection name (optional)"
            className="input-field w-full"
          />
        </div>

        {/* External URL */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            External URL
          </label>
          <input
            type="url"
            value={nftData.external_url}
            onChange={(e) => setNftData(prev => ({ ...prev, external_url: e.target.value }))}
            placeholder="https://your-website.com"
            className="input-field w-full"
          />
        </div>

        {/* Attributes */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center">
            <Tag className="w-4 h-4 mr-1" />
            Attributes
          </label>
          
          {/* Existing Attributes */}
          {nftData.attributes.length > 0 && (
            <div className="space-y-2 mb-4">
              {nftData.attributes.map((attr, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={attr.trait_type}
                    onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                    placeholder="Trait type"
                    className="input-field flex-1"
                  />
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="input-field flex-1"
                  />
                  <button
                    onClick={() => removeAttribute(index)}
                    className="w-10 h-12 bg-dark-700 hover:bg-dark-600 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Attribute */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newAttribute.trait_type}
              onChange={(e) => setNewAttribute(prev => ({ ...prev, trait_type: e.target.value }))}
              placeholder="Trait type"
              className="input-field flex-1"
            />
            <input
              type="text"
              value={newAttribute.value}
              onChange={(e) => setNewAttribute(prev => ({ ...prev, value: e.target.value }))}
              placeholder="Value"
              className="input-field flex-1"
            />
            <button
              onClick={addAttribute}
              className="w-10 h-12 bg-primary-600 hover:bg-primary-700 rounded-lg flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 