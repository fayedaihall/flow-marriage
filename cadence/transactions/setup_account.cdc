import Marriage from 0xf8d6e0586b0a20c7

transaction {
    prepare(acct: auth(Storage, Capabilities) &Account) {
        if acct.storage.borrow<&Marriage.Collection>(from: Marriage.CollectionStoragePath) == nil {
            acct.storage.save(<- Marriage.createEmptyCollection(), to: Marriage.CollectionStoragePath)
            acct.capabilities.publish(
                acct.capabilities.storage.issue<&Marriage.Collection>(Marriage.CollectionStoragePath),
                at: Marriage.CollectionPublicPath
            )
        }
    }
}


