const FS = require('fs').promises;

async function readFileOrCreate(path, defaultContent = '') {
    try {
        // 파일 읽기 시도
        return await FS.readFile(path, 'utf-8');
    } catch (error) {
        // 파일이 없는 경우의 에러 처리
        if (error.code === 'ENOENT') {
            console.log(`${path} not found. Creating a new one.`);
            // 파일이 없다면 기본 내용으로 새 파일 생성
            await FS.writeFile(path, '');
            return '';
        }
        // 다른 유형의 에러는 그대로 다시 던지기
        throw error;
    }
}

module.exports = {
    readFileOrCreate
}