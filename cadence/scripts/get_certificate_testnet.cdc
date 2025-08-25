import Marriage from 0x86a4bf5530e0e76e

access(all) fun main(address: Address, tokenId: UInt64): {String: String}? {
  let account = getAccount(address)
  let collectionRef = account.capabilities.borrow<&Marriage.Collection>(Marriage.CollectionPublicPath)
    ?? panic("Could not borrow collection reference")
  
  if let certificateRef = collectionRef.borrowCertificate(id: tokenId) {
    let metadata: {String: String} = {
      "id": certificateRef.id.toString(),
      "marriageId": certificateRef.marriageId.toString(),
      "spouseAName": certificateRef.metadata.spouseAName,
      "spouseBName": certificateRef.metadata.spouseBName,
      "weddingDate": certificateRef.metadata.weddingDate,
      "vows": certificateRef.metadata.vows,
      "location": certificateRef.metadata.location,
      "uri": certificateRef.metadata.uri
    }
    
    if let officiant = certificateRef.metadata.officiant {
      metadata["officiant"] = officiant
    }
    
    return metadata
  }
  
  return nil
}
