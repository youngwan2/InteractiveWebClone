(function () {
  // scrollY > prevSectionHightSum 이 되는 순간
  // activeSectionIndex 를 증가 시킨다.
  let scrollY = 0; //window.scrollY (전체 브라우저의 높이)
  let prevSectionHightSum = 0; //이전 섹션들 높이 합계
  let activeSectionIndex = 0; //현재 활성화된 섹션 인덱스(현재 스크롤 위치)
  let newSectionEnter = false; // 새로운 섹션이 시작되는 순간 true가 되도록
  // --------섹션들 정보를 담고 있는 객체
  const sectionArea = [
    // ---------섹션 0
    {
      //디바이스 마다 높이가 다르므로,각 디바이스 브라우저 높이 * 5배로 각 섹션 높이를 설정
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      HTMLobjects: {
        //각 섹션 HTML
        container: document.getElementById("scroll_section_0") as HTMLElement,
        messageA: document.querySelector(".section_0a") as HTMLDivElement,
        messageB: document.querySelector(".section_0b") as HTMLDivElement,
        messageC: document.querySelector(".section_0c") as HTMLDivElement,
        messageD: document.querySelector(".section_0d") as HTMLDivElement,
      },
      //메시지 영역 애니메이션 설정값(투명도)[시작,끝]
      // 섹션 내 스크롤 위치에 따른 투명도 조절 때 사용
      values: {
        //애니메이션이 시작되고 종료되는 시점
        //-----------------0--1--------------2
        messageA_opacity: [0, 1, { start: 0.1, end: 0.2 }],
        messageB_opacity: [0, 1, { start: 0.3, end: 0.4 }],
      },
    },
    // ----------섹션 1
    {
      //디바이스 마다 높이가 다르므로,각 디바이스 브라우저 높이 * 5배로 각 섹션 높이를 설정
      type: "basic",
      heightNum: 5,
      scrollHeight: 0,
      HTMLobjects: {
        //각 섹션 HTML
        container: document.getElementById("scroll_section_1") as HTMLElement,
      },
    },
    // ----------섹션 2
    {
      //디바이스 마다 높이가 다르므로,각 디바이스 브라우저 높이 * 5배로 각 섹션 높이를 설정
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      HTMLobjects: {
        //각 섹션 HTML
        container: document.getElementById("scroll_section_2") as HTMLElement,
      },
    },
    //---------- 섹션 3
    {
      //디바이스 마다 높이가 다르므로,각 디바이스 브라우저 높이 * 5배로 각 섹션 높이를 설정
      type: "basic",
      heightNum: 5,
      scrollHeight: 0,
      HTMLobjects: {
        //각 섹션 HTML
        container: document.getElementById("scroll_section_3") as HTMLElement,
      },
    },
  ];

  //  각 스크롤 섹션을 순회하면서 각 섹션 당 innerHeight 를 설정한다.
  const setLayout = () => {
    for (let i = 0; i < sectionArea.length; i++) {
      sectionArea[i].scrollHeight =
        sectionArea[i].heightNum * window.innerHeight;
      // if(sectionArea[i].HTMLobjects.container !==null)

      const scrollHeight = sectionArea[i].scrollHeight;
      sectionArea[ //해당 섹션의 높이를 지정한다.
        i
      ].HTMLobjects.container.style.height = `${scrollHeight}px`;
    }

    // 전체 스크롤 높이가 브라우저 스크롤의 높이 보다 크다면
    // 현재 활성화된 섹션을 현재 멈춘 섹션으로 설정하고
    // 실행을 중지한다.
    let totalScrollHeight = 0;
    for (let i = 0; i < sectionArea.length; i++) {
      totalScrollHeight += sectionArea[i].scrollHeight;
      if (totalScrollHeight >= scrollY) {
        activeSectionIndex = i;
        break;
      }
    }
    console.log(totalScrollHeight);
    // body의 id에 적용된 속성값에 따라 각 섹션을 활성화 한다.
    document.body.setAttribute("id", `show_section_${activeSectionIndex}`);
  };
  // 이 함수를 이용해서 투명도 0~1 사이를 조절하는 애니메이션 계산에 활용
  //-----------------투명도값, 각 섹션에서 스크롤 위치
  const calcValues = (values_A: any[], currentScrollY: number) => {
    let view: number;
    // 현재 섹션의 스크롤 높이
    const currentScrollHeight = sectionArea[activeSectionIndex].scrollHeight;
    //현재 섹션에서 스크롤 비율0 ~ 1 사이 = 해당 섹션에서 현재 스크롤 높이 / 해당 섹션의 전체 스크롤 높이
    const currentScrollRatio = currentScrollY / currentScrollHeight;

    if (values_A.length === 3) {
      // start ~ end 사이 애니메이션 실행
      // 부분 요소의 애니메이션 시작점과 끝점을 알았으니
      // 그 부분 요소의 시작점~ 끝점 사이의 스크롤 비율을 구해야 한다.
      const partScrollStart = values_A[2].start * currentScrollHeight;
      const partScrollEnd = values_A[2].end * currentScrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart; //요소 전체 높이

      if (
        // 부분요소의 총 높이보다 크면서, 부분요소의 끝지점 보다
        // 현재 스크롤 높이가 작아질 떄 까지 실행한다.
        currentScrollY >= partScrollHeight &&
        currentScrollY <= partScrollEnd
      ) {
        return view =
          // (현재 섹션 스크롤 높이 - 특정 요소의 스크롤 시작점)/ 특정 요소의 전체 스크롤 높이
          ((currentScrollY - partScrollStart) / partScrollHeight) *
            (values_A[1] - values_A[0]) +
          values_A[0];

        // 현재 스크롤 높이가 부분 요소의 시작점보다 작다면
      } else if (currentScrollY < partScrollStart) {
       return  view = values_A[0];

        // 현재 스크롤 높이가 부분 요소의 끝 지점을 벗어난다면
      } else if (currentScrollY > partScrollEnd) {
        return view = values_A[1];
      }
    } else {
      return view = currentScrollRatio * (values_A[1] - values_A[0]) + values_A[0];
    }
  };

  // 애니메이션 실행 관련 부분 처리하는 함수
  const playAnimation = () => {
    const HTMLobjects = sectionArea[activeSectionIndex].HTMLobjects;
    const values = sectionArea[activeSectionIndex].values;
    //각 섹션마다 스크롤 y가 새롭게 시작된다.
    // ---- 현재 섹션에서 스크롤y 높이 = 전체 스크롤 Y - 이전 섹션 스크롤 높이 합
    const currentScrollY = scrollY - prevSectionHightSum;

    switch (activeSectionIndex) {
      case 0:
        // calcValues 함수에서 반환받은 0~1 사이의 값이 저장된다.
        let messageA_opacity_in = calcValues(
          values?.messageA_opacity!,
          currentScrollY
        );
        HTMLobjects.messageA!.style.opacity = `${messageA_opacity_in}`;
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
    }
  };

  // 스크롤 이벤트를 실행하는 함수
  const scrollLoop = () => {
    newSectionEnter = false;
    prevSectionHightSum = 0; //이전 섹션들의 합계

    for (let i = 0; i < activeSectionIndex; i++) {
      prevSectionHightSum += sectionArea[i].scrollHeight;
    }
    //브라우저 스크롤 높이가 이전 섹션 높이의 합 + 현재 섹션의 높이 합 보다 크다면
    // activeSectionIndex 를 1 더 한다.
    if (
      scrollY >
      prevSectionHightSum + sectionArea[activeSectionIndex].scrollHeight
    ) {
      newSectionEnter = true;
      activeSectionIndex++;
    }
    // 스크롤 높이가 이전 섹션들의 합계 보다 작다면, activeSectionIndex 를 1 뺀다
    if (scrollY < prevSectionHightSum) {
      newSectionEnter = true;
      activeSectionIndex--;
    }

    // 새로운 섹션에 들어가는 경우 잠깐 play 함수 실행을 멈춘다.
    // 다음 섹션으로 넘어갈 때 비정상적인 - 값이 생기는 것을 막기 위함.
    if (newSectionEnter) return;

    playAnimation();
  };

  // 브라우저 크기가 달라질 때 마다 브라우저 내부 높이를 다르게 설정한다.
  window.addEventListener("resize", setLayout);
  // HTML, 이미지 등 리소스를 모두 로드한 뒤에 함수를 실행한다.
  window.addEventListener("load", setLayout);
  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
    scrollLoop();
    setLayout();
  });
})();
