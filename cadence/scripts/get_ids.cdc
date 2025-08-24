import Marriage from 0xf8d6e0586b0a20c7

access(all) fun main(owner: Address): [UInt64] {
    let ref = getAccount(owner)
        .capabilities.borrow<&Marriage.Collection>(Marriage.CollectionPublicPath)
        ?? panic("No public collection capability for owner")
    return ref.getIDs()
}


