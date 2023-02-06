
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Stack } from '@mui/material';
import { useState } from 'react';


const DataPage = (props) => {
    const [cacheData, setCacheData] = useState('캐시데이터 표시영역');

    const url = "supportLanguage.json";
    const cacheName = "lang";

    let date = new Date();
    date.setDate(date.getDate() + 7);
    function makeCookie() {
        document.cookie = `lang=ko-KR; expires=${date.toUTCString()}`;
    }

    function getCookieValue () {
        return document.cookie.match('(^|;)\\s*lang\\s*=\\s*([^;]+)')?.pop() || ''
    }

    function checkCookie() {
        let value = getCookieValue("lang");
        console.log(value);
    }

    async function openCaches() {
        await fetch(url).then(res => {
            console.log(res);
            caches.open(cacheName).then((cache) => {
                return cache.put(url, res)
            })
        })
            

    }

    function deleteCaches() {
        caches.delete(cacheName).then((res) => {
            setCacheData("lang캐시 제거 완료")
            console.log(res)
        });
    }

    function keysCaches() {
        caches.keys().then((keylist) => setCacheData(keylist))
    }

    function matchCaches() {
        caches.match(url).then((res) => {
            const testJson = res.clone();
            testJson.json().then((res2) => console.log(res2.lng))
            setCacheData("lang캐시 검색 완료")
        })
    }

    function hasCaches() {
        caches.has(cacheName).then((hasCache) => console.log(hasCache))
    }

    function checkBrowserLanguage() {
        let lang = undefined;
        if (navigator.language != null) lang = navigator.language;

        console.log(lang);
    }

    return (
        <Box>
            <Typography variant='h3'> 데이터 페이지입니다.</Typography>
            <Stack>
                <Stack direction='row'>
                    <Button onClick={openCaches}>
                        캐시생성
                    </Button>
                    <Button onClick={deleteCaches}>
                        캐시제거
                    </Button>
                    <Button onClick={keysCaches}>
                        캐시 키배열 확인
                    </Button>
                    <Button onClick={matchCaches}>
                        캐시 검색
                    </Button>
                    <Button onClick={hasCaches}>
                        캐시 유무 확인
                    </Button>
                    <Button onClick={checkBrowserLanguage}>
                        브라우저 언어 체크
                    </Button>
                </Stack>
                <Stack direction='row'>
                    <Button onClick={makeCookie}>
                        쿠키생성
                    </Button>
                    <Button onClick={checkCookie}>
                        쿠키체크
                    </Button>
                </Stack>
            </Stack>
            <Box>
                <Typography>{cacheData}</Typography>
            </Box>
        </Box>
    )
}
export default DataPage;