/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-29 14:07:40
 * @LastEditors: chenhua
 * @LastEditTime: 2024-07-19 11:00:23
 */
import utils from '@utils/utils';
const fileUrl = import.meta.env.VITE_FILE_ACCESS_API;

const GroupMember = ({ member }) => {

  return (
    <div className="group-member">
      {member.online && <i style={{width: '8px', height: '8px', background: '#00DE51', borderRadius: '50%'}}></i>}
       <img src={member?.image && (fileUrl + member?.image)} alt="Avatar" className='avatar' style={{marginLeft: member.online ? '8px' : '16px'}}/>
      <div className="member-name"> {member.nickname || utils.shortAccount(member.address,2)}</div>
    </div>
  );
};


export default GroupMember;
