import React from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

interface JazziconProps {
    address?: string,
    diameter?: number
}

const JazziconFC: React.FC<JazziconProps> = ({address, diameter = 20}) => (
    <Jazzicon diameter={diameter} seed={jsNumberForAddress(address)} />
)

export default JazziconFC
