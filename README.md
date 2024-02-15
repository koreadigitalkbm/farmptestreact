# platformtestv1
 팜스큐브 플랫폼 테스트용 버전
 

프로젝트 설치
백엔드
1. express 설치(npm install express --saved)
2. firebase 설치( npm install firebase-admin --saved)

프론트엔드
1. React 설치
2. mui 설치


클라이언트  설치순서
 1. nodejs  설치(v18.12)
 2. Git 설치( v2.30)
 3. 소스 받기 ( git clone https://github.com/koreadigitalkbm/farmptestreact.git)
 4. 패키지설치( backend, prontend 폴더 npm install)
 5. common/private 폴더 복사
 6. 프론트앤드 실행 (prontend/np serve)
 7. 백앤드 실행 (backend/node index.js )
 8. 이후 클라이언트 업데이트 (git pull) 명령어 사용 

주요폴더 설명
> 프로젝트명
> > backend : 백엔드 
> 
> > frontend : react app 소스
>
> > > > myapp/src/commonjs: 백엔드, 프론트엔드 공통사용소스 ( react js 파일은 /src 폴더에 있어야함. 때문에 공통으로 사용되는 부분 src 아래로 )
> 
> > > > myapp/src/page: 화면구성에 따라 페이지로구분
> 
> > > > > myapp/src/page/control: 자동제어관련 부분 복잡함으로 따로 폴더로 구분 

> 
> > common : 백엔드, 프론트엔드 공통사용
> 
> > > private :  중요파일 암호
> 
> > > local_files: 백엔드 저장되어지는 파일
> 

# MUI용 npm 라이브러리 설치(프론트)
npm install @mui/material @emotion/react @emotion/styled
npm install @fontsource/roboto
npm install @mui/icons-material

# 다국어지원 ( 프론트 )
npm install react-i18next i18next --saved

# DB 연동 (백엔드 )
npm install  mysql --saved


브렌치테스트2

# git pull  업데이트시 에러발생
git reset --hard HEAD  가장최신버전으로 바꾸자


# react 도메인 접속시 Invaild host Header
- 도메인연결시 에러발생시 서버쪽 코드만  /node_modules/react-scripts/config/webpackDevServer.config.js 수정(	const disableFirewall = true)

# ssh 장비접속
 sudo -s 루트권한
 pw : f**o*
 sudo pm2 monit 프로세서 모니터