import Marriage from 0x86a4bf5530e0e76e

access(all) fun main(owner: Address): [UInt64] {
    let ref = getAccount(owner)
        .capabilities.borrow<&Marriage.Collection>(Marriage.CollectionPublicPath)
        ?? panic("No public collection capability for owner")
    return ref.getIDs()
}
