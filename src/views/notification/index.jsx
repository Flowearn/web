import tz_icon_ta from '@statics/images/tz_icon_ta.png';
import wd_icon_shanchu from '@statics/images/wd_icon_shanchu.png';
import wd_icon_tianjia from '@statics/images/wd_icon_tianjia.png'
import tz_icon_ta2 from '@statics/images/tz_icon_ta2.png';
import './index.scss'
import { getNotification } from "@/services/index";
import { useEffect, useState, useRef } from 'react';
import utils from '@utils/utils';
import Decimal from '@comp/decimal';
const fileUrl = import.meta.env.VITE_FILE_ACCESS_API;

const pageSize = 50;
const scrollThreshold = 200; 
function Notification() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(null);
  const containerRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false); 
  const [hasMore, setHasMore] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const fetchData = async (newCursor) => {
    if (loading || !hasMore || isFetching) return; 
   
    setLoading(true); 
    setIsFetching(true); 
    
    try {
      const response = await getNotification({last_id: newCursor, page_size: pageSize});
      if (!response) {
        throw new Error('No response from the server');
      }
      const newData = response; 

      let updatedData;
      if (newCursor) {
        const filteredNewData = newData.filter(newItem => !data.some(prevItem => prevItem.ID === newItem.ID));
        updatedData = [...data, ...filteredNewData];
      } else {
        updatedData = [...newData];
      }
      
      // let dataArr = await dealData(updatedData)
      setData(updatedData);
      setCursor(newData.length ? newData[newData.length - 1]?.ID : null);
      setHasMore(newData.length === pageSize && newData.length != 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      setHasMore(false); 
    } finally {
      setLoading(false); 
      setIsFetching(false); 
    }
  };

  const dealData = (data) => {
    data.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
    const newData = [];
    data.forEach(item => {
      const existingItem = newData.find(newItem => newItem.portfolio_id === item.portfolio_id && newItem.op_type === item.op_type);
      item.isTrue = false;
      if (existingItem) {
          const childItem = { ...item };
          delete childItem.children; // 避免将 children 字段作为子节点的一部分
          existingItem.children = existingItem.children || [];
          existingItem.children.push(childItem);
      } else {
          const newItem = { ...item };
          newItem.children = [];
          delete newItem.children; // 避免将 children 字段作为根节点的一部分
          newData.push(newItem);
      }
    });
    return newData;
  }

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;

    if (scrollTop + clientHeight >= scrollHeight - scrollThreshold) {
      if (!loading && !isFetching && hasMore) { // 检查新状态变量
        fetchData(cursor);
      }
    }
  };

  useEffect(() => {
    fetchData(null); // 初始化加载数据
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [data]);

  const DealType = (type) => {
    if(type === 'increase'){
      return 'Token Amount Increased'
    }else if(type === 'add'){
      return 'New Token Added'
    }else if(type === 'delete'){
      return 'Token Sold'
    }else{
      return 'Token Amount Decreased'
    }
  }

  const dealImg = (type) => {
    if(type === 'increase'){
      return tz_icon_ta
    }else if(type === 'add'){
      return wd_icon_tianjia
    }else if(type === 'delete'){
      return wd_icon_shanchu
    }else{
      return tz_icon_ta2
    }
  }

  const handleToggleExpand = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  // const formatAmount = (amount) => {
  //   return amount < 0 ? `-$${Math.abs(amount).toFixed(2)}` : `$${amount.toFixed(2)}`;
  // }

  // const dealCopywriting = (item) => {
  //   const formattedAmount = formatAmount(item.amount * item.price);
  //   const portion = (item.portion / 100).toFixed(4);
  //   const formattedPortion = portion*1 < 0 ? `-$${Math.abs(portion*1).toFixed(4)}` : `${portion*1}`; // 处理负数并添加负号和美元符号
  //   const amount = item.amount.toFixed(4);
  //   const shortAccount = utils.shortAccount(item.address, 2);
  //   const tokenName = item.token_name;
  
  //   if (item.op_type === 'increase') {
  //     return `${shortAccount} added ${amount} “${tokenName}" to the portfolio, comprising ${formattedPortion}% of the previous total “${tokenName}"`;
  //   } else if (item.op_type === 'add') {
  //     return `${shortAccount} added ${amount} “${tokenName}" to the portfolio, approximately ${formattedAmount}`;
  //   } else if (item.op_type === 'delete') {
  //     return `${shortAccount} sold all “${tokenName}" from the portfolio, approximately ${formattedAmount}`;
  //   } else {
  //     return `${shortAccount} sold ${amount} “${tokenName}" from the portfolio, comprising ${formattedPortion}% of the previous total “${tokenName}"`;
  //   }
  // }  

  const dealCopywriting = (item) => {
    const formattedAmount = item.amount * item.price;
    const portion = (item.portion * 100).toFixed(2);
    const amount = item.amount.toFixed(2);
    const shortAccount = item?.Nickname || utils.shortAccount(item.address, 2);
    const tokenName = item.token_name;

    const type = portion*1 < 0 ? true : false;
   
    const formattedPortion = <Decimal decimal={Math.abs(portion * 1)} position={4}  />
    console.log(type ? `-$` : `$${formattedPortion}`, '------------------')
    const formattedAmountComponent = formattedAmount < 0 ? (
      <Decimal decimal={Math.abs(formattedAmount)} position={2} prefix="-$" />
    ) : (
      <Decimal decimal={formattedAmount} position={2} prefix="$" />
    );
  
    if (item.op_type === 'increase') {
      return (
        <>
          {shortAccount} has bought {amount} &quot;{tokenName}&quot; for the portfolio, comprising {formattedPortion}% of the previous total &quot;{tokenName}&quot;
        </>
      );
    } else if (item.op_type === 'add') {
      return (
        <>
          {shortAccount} has bought {amount} &quot;{tokenName}&quot; for the portfolio, approximately <span>${formattedAmountComponent}</span>, which constitutes {Math.abs(portion)
          }% of the total portfolio value
        </>
      );
    } else if (item.op_type === 'delete') {
      return (
        <>
          {shortAccount} has sold {amount} &quot;{tokenName}&quot;from the portfolio, approximately <span>${formattedAmountComponent}</span>which constitutes {Math.abs(portion)
          }% of the total portfolio value
        </>
      );
    } else {
      return (
        <>
          {shortAccount} has sold {amount} &quot;{tokenName}&quot; from the portfolio, comprising {formattedPortion}% of the previous total &quot;{tokenName}&quot;
          {/* {shortAccount} has sold {amount} &quot;{tokenName}&quot; from the portfolio, comprising {type ? `-` : ``}{formattedPortion}% of the previous total &quot;{tokenName}&quot; */}
        </>
      );
    }
  };

  return (
    <div className="contentBox">
      <h2 className='pageTitle notificationName'>Notification</h2>
      {
        data?.length !== 0 && <div className='notification' ref={containerRef} style={{ overflowY: 'scroll' }}>
          {
            data?.map((item, index) => (
              <div className='notification-item' key={index}>
                <div className="notification-item-img">
                  <img className="avatar" alt="" src={fileUrl + item.Image} />
                  <img className="typeImg" src={dealImg(item.op_type)} />
                </div>
                <div className='notification-item-info'>
                  <p className='token'>{DealType(item.op_type)}<span>{utils.dealTime(item.CreatedAt)}</span></p>
                  <p className='portfolio'>{dealCopywriting(item)}</p>                  
                  {index === expandedIndex && (
                    <div>
                      {
                        item?.children?.map((v,i) => (
                          <div className='portfolio' key={i}>{dealCopywriting(v)}</div>   
                        ))
                      }
                    </div>
                  )}
                  { item?.children && <p className='more' onClick={() => handleToggleExpand(index)}><span>{expandedIndex === index ? 'retract' : 'more'}</span></p> }
                </div>
              </div>
            ))
          }
        </div>
      }
    </div>
  );
}
export default Notification;

