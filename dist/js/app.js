"use strict";
(function () {
    let scrollY = 0;
    let prevSectionHightSum = 0;
    let activeSectionIndex = 0;
    let newSectionEnter = false;
    const sectionArea = [
        {
            type: "sticky",
            heightNum: 5,
            scrollHeight: 0,
            HTMLobjects: {
                container: document.getElementById("scroll_section_0"),
                messageA: document.querySelector(".section_0a"),
                messageB: document.querySelector(".section_0b"),
                messageC: document.querySelector(".section_0c"),
                messageD: document.querySelector(".section_0d"),
            },
            values: {
                messageA_opacity: [0, 1, { start: 0.1, end: 0.2 }],
                messageB_opacity: [0, 1, { start: 0.3, end: 0.4 }],
            },
        },
        {
            type: "basic",
            heightNum: 5,
            scrollHeight: 0,
            HTMLobjects: {
                container: document.getElementById("scroll_section_1"),
            },
        },
        {
            type: "sticky",
            heightNum: 5,
            scrollHeight: 0,
            HTMLobjects: {
                container: document.getElementById("scroll_section_2"),
            },
        },
        {
            type: "basic",
            heightNum: 5,
            scrollHeight: 0,
            HTMLobjects: {
                container: document.getElementById("scroll_section_3"),
            },
        },
    ];
    const setLayout = () => {
        for (let i = 0; i < sectionArea.length; i++) {
            sectionArea[i].scrollHeight =
                sectionArea[i].heightNum * window.innerHeight;
            const scrollHeight = sectionArea[i].scrollHeight;
            sectionArea[i].HTMLobjects.container.style.height = `${scrollHeight}px`;
        }
        let totalScrollHeight = 0;
        for (let i = 0; i < sectionArea.length; i++) {
            totalScrollHeight += sectionArea[i].scrollHeight;
            if (totalScrollHeight >= scrollY) {
                activeSectionIndex = i;
                break;
            }
        }
        console.log(totalScrollHeight);
        document.body.setAttribute("id", `show_section_${activeSectionIndex}`);
    };
    const calcValues = (values_A, currentScrollY) => {
        let view;
        const currentScrollHeight = sectionArea[activeSectionIndex].scrollHeight;
        const currentScrollRatio = currentScrollY / currentScrollHeight;
        if (values_A.length === 3) {
            const partScrollStart = values_A[2].start * currentScrollHeight;
            const partScrollEnd = values_A[2].end * currentScrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;
            if (currentScrollY >= partScrollHeight &&
                currentScrollY <= partScrollEnd) {
                return view =
                    ((currentScrollY - partScrollStart) / partScrollHeight) *
                        (values_A[1] - values_A[0]) +
                        values_A[0];
            }
            else if (currentScrollY < partScrollStart) {
                return view = values_A[0];
            }
            else if (currentScrollY > partScrollEnd) {
                return view = values_A[1];
            }
        }
        else {
            return view = currentScrollRatio * (values_A[1] - values_A[0]) + values_A[0];
        }
    };
    const playAnimation = () => {
        const HTMLobjects = sectionArea[activeSectionIndex].HTMLobjects;
        const values = sectionArea[activeSectionIndex].values;
        const currentScrollY = scrollY - prevSectionHightSum;
        switch (activeSectionIndex) {
            case 0:
                let messageA_opacity_in = calcValues(values === null || values === void 0 ? void 0 : values.messageA_opacity, currentScrollY);
                HTMLobjects.messageA.style.opacity = `${messageA_opacity_in}`;
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
    };
    const scrollLoop = () => {
        newSectionEnter = false;
        prevSectionHightSum = 0;
        for (let i = 0; i < activeSectionIndex; i++) {
            prevSectionHightSum += sectionArea[i].scrollHeight;
        }
        if (scrollY >
            prevSectionHightSum + sectionArea[activeSectionIndex].scrollHeight) {
            newSectionEnter = true;
            activeSectionIndex++;
        }
        if (scrollY < prevSectionHightSum) {
            newSectionEnter = true;
            activeSectionIndex--;
        }
        if (newSectionEnter)
            return;
        playAnimation();
    };
    window.addEventListener("resize", setLayout);
    window.addEventListener("load", setLayout);
    window.addEventListener("scroll", () => {
        scrollY = window.scrollY;
        scrollLoop();
        setLayout();
    });
})();
