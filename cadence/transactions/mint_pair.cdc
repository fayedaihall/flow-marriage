import Marriage from 0xf8d6e0586b0a20c7

transaction(
    recipientA: Address,
    recipientB: Address,
    spouseAName: String,
    spouseBName: String,
    weddingDate: String,
    vows: String,
    location: String,
    uri: String,
    officiant: String?
) {
    let minterRef: &Marriage.Minter

    prepare(acct: auth(Storage) &Account) {
        self.minterRef = acct.storage.borrow<&Marriage.Minter>(from: Marriage.MinterStoragePath)
            ?? panic("Minter not found in signer account. The contract account must sign.")
    }

    execute {
        let receiverA = getAccount(recipientA)
            .capabilities.borrow<&Marriage.Collection>(Marriage.CollectionPublicPath)
            ?? panic("Recipient A has not set up a Marriage collection.")

        let receiverB = getAccount(recipientB)
            .capabilities.borrow<&Marriage.Collection>(Marriage.CollectionPublicPath)
            ?? panic("Recipient B has not set up a Marriage collection.")

        let metadata = Marriage.Metadata(
            spouseAName: spouseAName,
            spouseBName: spouseBName,
            weddingDate: weddingDate,
            vows: vows,
            location: location,
            uri: uri,
            officiant: officiant
        )

        let result = self.minterRef.mintPair(
            recipientA: receiverA,
            recipientB: receiverB,
            metadata: metadata,
            toA: recipientA,
            toB: recipientB
        )

        log(result)
    }
}


