//DB 검색 쿼리내용


module.exports = class DBQueryParam {
  constructor(mstartday,mendday,tablename) {
    this.StartDay = mstartday;
    this.EndDay = mendday;
    this.TableName = tablename; //table 이름 : sensor, camera, event  세중 하나
    
  }

  
};
