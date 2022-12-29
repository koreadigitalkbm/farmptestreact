
//시스템 디버깅을위해 중요에러또는 정보사항을 기록하고 볼수 있도록 한다.
module.exports =  class devicesystemlog{
    constructor()
    {
        this.loglist = []; 
    }
    //메모리에 중요로그 기록 웹으로 모니터링
    memlog(logmsg){
        let today = new Date(); 
        let datelog=today.toLocaleString() + " : "+ logmsg;
        console.log(datelog);
        this.loglist.push(datelog);
        if(this.loglist.length >=1000)
        {
            this.loglist.splice(0, 100);
        }

    }
}
 