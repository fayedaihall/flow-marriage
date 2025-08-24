access(all) contract Marriage {

    access(all) let CollectionStoragePath: StoragePath
    access(all) let CollectionPublicPath: PublicPath
    access(all) let MinterStoragePath: StoragePath

    access(all) var totalSupply: UInt64
    access(all) var nextTokenId: UInt64
    access(all) var nextMarriageId: UInt64

    access(all) event ContractInitialized()
    access(all) event Deposit(tokenId: UInt64, to: Address?)
    access(all) event Withdraw(tokenId: UInt64, from: Address?)
    access(all) event PairMinted(marriageId: UInt64, tokenIdA: UInt64, tokenIdB: UInt64, toA: Address, toB: Address)

    access(all) struct Metadata {
        access(all) let spouseAName: String
        access(all) let spouseBName: String
        access(all) let weddingDate: String
        access(all) let vows: String
        access(all) let location: String
        access(all) let uri: String
        access(all) let officiant: String?

        init(
            spouseAName: String,
            spouseBName: String,
            weddingDate: String,
            vows: String,
            location: String,
            uri: String,
            officiant: String?
        ) {
            self.spouseAName = spouseAName
            self.spouseBName = spouseBName
            self.weddingDate = weddingDate
            self.vows = vows
            self.location = location
            self.uri = uri
            self.officiant = officiant
        }
    }

    access(all) resource Certificate {
        access(all) let id: UInt64
        access(all) let marriageId: UInt64
        access(all) let metadata: Metadata

        init(id: UInt64, marriageId: UInt64, metadata: Metadata) {
            self.id = id
            self.marriageId = marriageId
            self.metadata = metadata
        }
    }

    access(all) resource interface CollectionPublic {
        access(all) fun deposit(token: @Certificate)
        access(all) fun borrowCertificate(id: UInt64): &Certificate?
        access(all) fun getIDs(): [UInt64]
    }

    access(all) resource Collection: CollectionPublic {
        access(all) var owned: @{UInt64: Certificate}

        init() {
            self.owned <- {}
        }

        access(all) fun deposit(token: @Certificate) {
            let tokenId = token.id
            self.owned[tokenId] <-! token
            emit Deposit(tokenId: tokenId, to: self.owner?.address)
        }

        access(all) fun withdraw(withdrawID: UInt64): @Certificate {
            let token <- self.owned.remove(key: withdrawID) 
                ?? panic("Missing certificate with this ID")
            emit Withdraw(tokenId: token.id, from: self.owner?.address)
            return <- token
        }

        access(all) fun borrowCertificate(id: UInt64): &Certificate? {
            return &self.owned[id] as &Certificate?
        }

        access(all) fun getIDs(): [UInt64] {
            return self.owned.keys
        }
    }

    access(all) fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    access(self) fun mintCertificate(
        marriageId: UInt64,
        metadata: Metadata
    ): @Certificate {
        self.nextTokenId = self.nextTokenId + 1
        self.totalSupply = self.totalSupply + 1
        return <- create Certificate(
            id: self.nextTokenId,
            marriageId: marriageId,
            metadata: metadata
        )
    }

    access(all) resource Minter {
        access(all) fun mintPair(
            recipientA: &Marriage.Collection,
            recipientB: &Marriage.Collection,
            metadata: Metadata,
            toA: Address,
            toB: Address
        ): [UInt64] {
            let marriageId = Marriage.nextMarriageId
            Marriage.nextMarriageId = Marriage.nextMarriageId + 1

            let certA <- Marriage.mintCertificate(marriageId: marriageId, metadata: metadata)
            let certB <- Marriage.mintCertificate(marriageId: marriageId, metadata: metadata)

            let tokenIdA = certA.id
            let tokenIdB = certB.id

            recipientA.deposit(token: <- certA)
            recipientB.deposit(token: <- certB)

            emit PairMinted(
                marriageId: marriageId,
                tokenIdA: tokenIdA,
                tokenIdB: tokenIdB,
                toA: toA,
                toB: toB
            )

            return [marriageId, tokenIdA, tokenIdB]
        }
    }

    init() {
        self.CollectionStoragePath = /storage/MarriageCollection
        self.CollectionPublicPath = /public/MarriageCollection
        self.MinterStoragePath = /storage/MarriageMinter

        self.totalSupply = 0
        self.nextTokenId = 0
        self.nextMarriageId = 1

        self.account.storage.save(<- create Minter(), to: self.MinterStoragePath)

        emit ContractInitialized()
    }
}


