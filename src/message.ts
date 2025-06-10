import { okx } from "./okx";

function getEmoji(percentChange: number): string {
    if (percentChange > 10) return '🚀'; // 飙升
    else if (percentChange > 5) return '📈'; // 大涨
    else if (percentChange > 2) return '🆙️'; // 小涨
    else if (percentChange > 1) return '🌱'; // 微涨
    else if (percentChange > 0) return '🔝'; // 微微涨
    else if (percentChange === 0) return '😐'; // 平稳
    else if (percentChange > -1) return '🔽️'; // 微微跌
    else if (percentChange > -2) return '🌾'; // 微跌
    else if (percentChange > -5) return '📉'; // 小跌
    else if (percentChange > -10) return '💥'; // 大跌
    else return '🕳️'; // 暴跌
}



export async function generateMessage(coinType:string) {
    const cryptoDataInfo=await okx.getCryptoInfo(coinType)
    
    if(!cryptoDataInfo.states){
        console.log(cryptoDataInfo)
        throw new Error('获取数据失败')
        
    }
    const cryptoData=cryptoDataInfo.data!

    const emoji = getEmoji(cryptoData.deviationPercent);
    let message = `${emoji} ${coinType}行情更新 ${cryptoData.utc8Time}\n\n` +
           `当前价格: ${cryptoData.currentPrice.toFixed(2)}\n` +
           `5日均价: ${cryptoData.ma5.toFixed(2)} (偏离: ${cryptoData.deviationPercent.toFixed(2)}%)\n` +
           `100日最高价: ${cryptoData.maxPrice.toFixed(2)}\n` +
           `100日最低价: ${cryptoData.minPrice.toFixed(2)}\n` +
           `前一日交易量相较于前五日平均交易量变化的百分比: ${cryptoData.volumeDeviationPercent.toFixed(2)}%\n\n` +
           `近5日K线数据:\n`;
           
    cryptoData.recent5Candles.forEach(candle => {
        message += `${candle.utc8Time} 开盘:${candle.open.toFixed(2)} 最高:${candle.high.toFixed(2)} 最低:${candle.low.toFixed(2)} 收盘:${candle.close.toFixed(2)} 成交量:${candle.volume.toFixed(2)}\n`;
    });
    
    return message;
         
}
