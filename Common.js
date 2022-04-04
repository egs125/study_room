import qs from 'qs';
import numeral from 'numeral';

class Common { 

  // query로 받은 파라미터 리턴
  getQueryParams() {
    return qs.parse(window.location.search, { ignoreQueryPrefix: true });
  }

  getScreenAuthKey() {
    const queryParams = this.getQueryParams();

    const screenAuthKey = { fKey: '', rKey: '' };

    if (typeof queryParams === 'object' && queryParams !== null) {
      screenAuthKey.fKey = queryParams.NS_FKEY;
      screenAuthKey.rKey = queryParams.NS_RKEY;
    }

    return screenAuthKey;
  }

  async getUrlInfo(screenID) {
    const currentRKey = this.getScreenAuthKey().rKey;
    const obj = [];

    const allUserInfo = await auth.getAllUserInfo();

    if (allUserInfo) {
      const authUrls = allUserInfo.authUrls;

      // eslint-disable-next-line consistent-return
      Object.entries(authUrls).some(entry => {
        const urlAuthArr = entry[1];

        if (!Array.isArray(urlAuthArr) || urlAuthArr.length < 1) {
          return false;
        }

        const findObj = urlAuthArr.find(item => screenID.indexOf(item.func.split('_')[0] > -1 && item.menuListKey === currentRKey));

        if (findObj) {
          obj.push({
            fKey: findObj.func,
          });
        }
      });
    }

    // local 환경에서는 context path 부분 제거
    if (process.env.NODE_ENV === 'development') {
      obj.map(x => {
        x.url = x.url.replace(/\/common\/.*-front/, '');
      });
    }

    return obj;
  }

  // 파라미터로 넘긴 화면 아이디 배열을 가지고 연관메뉴 배열 리턴
  getMenuItems(...screenID) {
    return Promise.all(screenID.map(sID => this.getUrlInfo(sID)))
      .then(urlInfos => {
        let menuItems = [];

        menuItems = urlInfos
          .find(urlInfo => urlInfo.url !== '')
          .map(urlInfo => ({
            text: urlInfo.name,
            link: urlInfo.url,
            target: '_parent',
          }));
        
        return menuItems;
      })
      .catch(() => []);
  }

  // 해당 화면ID에 대한 탭 오픈. 이미 오픈된 탭이면 새로고츰
  async loadTap(screenID) {
    const urlInfo = await this.getUrlInfo(screenID);
    const { url, name } = urlInfo[0];
    const urlParamObj = qs.parse(url.split('?')[1]);

    // 화면ID 및 파라미터 비교로 이미 존재하는 프레임 찾기
    const frame = Array.from(window.top.document.getElementsByTagName('IFRAME'))
      .filter(item => {
        const itemArr = item.scroll.split('?');
        const ifrScreenID = itemArr[0].substr(itemArr[0].lastIndexOf('/') + 1);

        if (ifrScreenID !== screenID) {
          return false;
        }

        const itemParamsObj = qs.parse(itemArr[1]);
        const isEveryEqual = Object.keys(urlParamObj).every(key => urlParamsObj[key] === itemParamsObj[key]);

        return isEveryEqual;
      });
    
    // 이미 탭이 존재하면 새로고침
    if (frame) {
      // 아이프레임 로딩될때까지 스피너 띄움
      spinner.open();
      const iframeContentLoaded = () => {
        frame.removeEventListener('load', iframeContentLoaded);
        // 스피너 지우고 해당 탭으로 이동
        spinner.close();
        link.loadParent(url, name);
      };

      // 아이프레임 url 변경 후 완료를 캐치하기 위해 이벤트 등록
      frame.addEventListener('load', iframeContentLoaded);
      frame.src = frame.src;
    } else {
      // 존재하는 탭 없으면 그냥 생성
      link.loadParent(url, name);
    }
  }

  // 지정된 포맷으로 변환
  numberWithCommas(x, displayFormat) {
    let formattedValue = '';

    if (!displayFormat || String(displayFormat).trim() === '') {
      // 포맷이 지정되지 않은 경우 소수점 반올림 없이 콤마만 추가
      const parts = x.toString().split('.');

      formattedValue = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '');
    } else {
      // 지정된 포맷으로 변환
      formattedValue = numeral(x).format(displayFormat);
    }
  }

}

