/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-01-03 19:12:29
 * @LastEditors: chenhua
 * @LastEditTime: 2024-01-17 14:39:08
 */
import { Table } from 'antd';
import CommHeader from '../../components/commHeader';
import home_icon_soon from '@/statics/images/home_icon_soon.png';
import './index.scss'
function MyWatchimg() {
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ];
  
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];
  return (
    <>
      <h2 className='pageTitle'>MyWatchimg</h2>
      <div className='myWatchimg'>
        <CommHeader />
        <div className='myWatchimg-table'>
          <Table dataSource={dataSource} columns={columns} pagination={false}/>
        </div>
        <div className='myPortfoLio-form soon'>
          <img src={home_icon_soon} />
          <div>Chatroom Coming Soon</div>
        </div>
        <div className='myPortfoLio-form soon'>
          <img src={home_icon_soon} />
          <div>Chart Details Coming Soon</div>
        </div>
      </div>
    </>
    
  );
}
export default MyWatchimg;
