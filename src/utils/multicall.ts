import ethers, { BigNumber, Contract, utils } from "ethers"
import MulticallAbi from "../constants/abi/Multicall.json";
import { Network, NetworksName } from "../config/index";

const IMulticall = new utils.Interface(MulticallAbi)

interface Call {
  target: string;
  callData: string;
}

interface MulticallResult {
  blockNumber: number;
  returnData: string[];
}

const provider = ethers.getDefaultProvider(NetworksName[Network])
export const Multicall = new Contract(
  process.env.REACT_APP_MULTICALL_ADDRESS,
  IMulticall,
  provider
)

export const aggregateCalls = async (calls: Call[]): Promise<MulticallResult> => {
  const [blockNumber, returnData] = await Multicall.callStatic.aggregate(calls)
  return {
    blockNumber: (<BigNumber>blockNumber).toNumber(),
    returnData
  }
}