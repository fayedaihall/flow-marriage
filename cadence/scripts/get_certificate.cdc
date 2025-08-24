import Marriage from 0xf8d6e0586b0a20c7

access(all) fun main(owner: Address, id: UInt64): {String: String} {
    let ref = getAccount(owner)
        .capabilities.borrow<&Marriage.Collection>(Marriage.CollectionPublicPath)
        ?? panic("No public collection capability for owner")
    let certRef = ref.borrowCertificate(id: id) ?? panic("Certificate not found")

    let data: {String: String} = {
        "id": certRef.id.toString(),
        "marriageId": certRef.marriageId.toString(),
        "spouseAName": certRef.metadata.spouseAName,
        "spouseBName": certRef.metadata.spouseBName,
        "weddingDate": certRef.metadata.weddingDate,
        "vows": certRef.metadata.vows,
        "location": certRef.metadata.location,
        "uri": certRef.metadata.uri
    }

    if let off = certRef.metadata.officiant {
        data["officiant"] = off
    }

    return data
}


