


 class devicesystemlog{
    
    constructor()
    {
        this.logarr = new Array(200); 
        this.nindex =0;

    }
    //메모리에 중요로그 기록 웹으로 모니터링
    memlog(logmsg){
        let today = new Date(); 
        let datelog=today.toLocaleString() + " : "+ logmsg;

        this.logarr[this.nindex]  = datelog;


        console.log(this.logarr[this.nindex]);

        this.nindex++;
        if(this.nindex >=200)
        {
            this.nindex=0;
        }
        

    }
}
module.exports = devicesystemlog;