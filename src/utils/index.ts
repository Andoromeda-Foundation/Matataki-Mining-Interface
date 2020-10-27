import BigNumber from 'bignumber.js'

export { default as formatAddress } from './formatAddress'

export const bnToDec = (bn: BigNumber, decimals = 18): number => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber()
}

export const decToBn = (dec: number, decimals = 18) => {
  return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals))
}

// 转二维
export const arraySlice = (list: any[], n: number) => {
  let len = list.length;
  let lineNum = len % n === 0 ? len / n : Math.floor((len / n) + 1);
  let res = [];
  for (let i = 0; i < lineNum; i++) {
    let temp = list.slice(i * n, i * n + n);
    res.push(temp);
  }
  return res
}

export const iconxx = (str: string) => {
  let iconList: any = {
    a: '🍝',
    b: '🍜',
    c: '🍲',
    d: '🍛',
    e: '🍱',
    f: '🍙',
    g: '🍘',
    h: '🍥',
    i: '🍰',
    j: '🎂',
    k: '🍮',
    l: '🍿',
    m: '🍩',
    n: '🌰',
    o: '🥜',
    p: '🌯',
    q: '🌭',
    r: '🍔',
    s: '🍟',
    t: '🍞',
    u: '🥩',
    v: '🍕',
    w: '🦪',
    x: '🥪',
    y: '🥞',
    z: '🥟',
  }
  return iconList[str.toLocaleLowerCase()] || '🍒'
}