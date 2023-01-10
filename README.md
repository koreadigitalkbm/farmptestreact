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
 1. nodejs  설치
 2. 소스 받기 ( git clone https://github.com/koreadigitalkbm/farmptestreact.git)
 3. 패키지설치( backend, prontend 폴더 npm install)
 4. common/private 폴더 복사
 5. 프론트앤드 실행 (prontend/np serve)
 6. 백앤드 실행 (backend/node index.js )

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

# MUI용 npm 라이브러리 설치
npm install @mui/material @emotion/react @emotion/styled
npm install @fontsource/roboto
npm install @mui/icons-material

# 다국어지원
npm install react-i18next i18next --saved


브렌치테스트2




