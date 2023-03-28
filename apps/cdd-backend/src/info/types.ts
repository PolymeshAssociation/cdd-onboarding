import { ApiProperty } from '@nestjs/swagger';
import { BigNumber } from '@polymeshassociation/polymesh-sdk';
import { NetworkProperties } from '@polymeshassociation/polymesh-sdk/types';

export class NetworkDetails {
  @ApiProperty({
    description: 'network name of the connected chain node',
  })
  name: string;

  @ApiProperty({
    description: 'spec version of the connected chain node',
  })
  version: BigNumber;

  constructor(network: NetworkProperties) {
    this.name = network.name;
    this.version = network.version;
  }
}

export class PolymeshNetworkResponse {
  @ApiProperty({
    description: 'the ss58 format of the connected chain node',
  })
  ss58Format: BigNumber;

  @ApiProperty({
    description: 'latest block number of the chain node',
  })
  latestBlockNumber: BigNumber;

  @ApiProperty({
    description: 'polymesh network details',
  })
  network: NetworkDetails;

  constructor(
    ss58Format: BigNumber,
    latestBlockNumber: BigNumber,
    network: NetworkProperties
  ) {
    this.ss58Format = ss58Format;
    this.latestBlockNumber = latestBlockNumber;
    this.network = network;
  }
}
