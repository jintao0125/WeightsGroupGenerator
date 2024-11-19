// 页面加载时默认生成8个输入框
window.onload = function () {
    // 钢蛋 5 勾栏听曲 4 捞得一 4 后知后觉 4 传印 4 狗蛋 2 云白 4 兴沛 3 候 3
    let a = [
        {"name": "钢蛋", "weight": "5"},
        {"name": "勾栏听曲", "weight": "4"},
        {"name": "捞得一", "weight": "4"},
        {"name": "后知后觉", "weight": "4"},
        {"name": "传印", "weight": "4"},
        {"name": "狗蛋", "weight": "2"},
        {"name": "兴沛", "weight": "3"},]
    a.forEach(e => {
        addName(e.name, e.weight);

    })
}

function addName(name, weight) {
    let index = document.querySelectorAll('.containerInput').length;

    // 创建新的输入框
    const inputModel = `<div id='key-${index}' class="row containerInput">
                            <span class="memberIndex">${index + 1}.</span>
                            <input type="text" placeholder="${name}" value="${name}" onkeypress="this.style.borderColor = '#a5a5a5'" class="members word">
                            <input type="number" min="1" max="5" placeholder="${weight}" value="${weight}" class="weight word">
                        </div>`;
    const input = document.querySelectorAll('.containerInput');
    input[input.length - 1].insertAdjacentHTML("afterend", inputModel);
}

function removeInput() {
    // 获取所有的输入框
    const inputs = document.querySelectorAll('.members');
    if (inputs.length > 8) {  // 确保有超过8个输入框
        // 删除索引最大的两个输入框
        inputs[inputs.length - 1].parentNode.remove();
        inputs[inputs.length - 2].parentNode.remove();

        // 更新序号和权重输入框
        updateIndexAndWeight();
    }
}

function updateIndexAndWeight() {
    const inputs = document.querySelectorAll('.containerInput');
    inputs.forEach((input, index) => {
        // 更新每个输入框的序号
        const nameInput = input.querySelector('.members');
        nameInput.placeholder = `Nome ${index + 1}`;  // 更新姓名输入框的提示文字

        // 获取权重输入框并更新其序号
        const weightInput = input.querySelector('.weight');
        if (weightInput) {
            weightInput.placeholder = `Peso ${index + 1}`;  // 更新权重输入框的提示文字
        }
    });
}

function changeNumberMember(number) {
    const nMember = document.querySelector('#Number');
    let valueMember = Number(nMember.value) + number;

    // 设置每组人数的最小值和最大值
    if (valueMember >= 4 && valueMember <= 5) {
        nMember.value = valueMember;
    }
    if (number == 1 && valueMember <= 5) {
        addName("名称","3")
        addName("名称","3")
    } else if (number == -1) {
        removeInput()
    }
}

function validateAllInput() {
    let listOfInputs = document.querySelectorAll('.members');
    let returnValue = true;
    listOfInputs.forEach((item, i) => {
        if (item.value.length < 1) {
            item.style.borderColor = 'red';
            returnValue = false;
        }
    });
    return returnValue;
}

function generateGroup() {
    let member = document.querySelectorAll('.members');
    let valueMember = [];
    let weightMember = [];

    // 收集所有成员的名字和权重
    member.forEach(e => {
        valueMember.push(e.value);
    });

    let weight = document.querySelectorAll('.weight');
    weight.forEach(e => {
        let weightValue = Number(e.value);
        if (isNaN(weightValue) || weightValue < 1 || weightValue > 5) {
            setToasted(false, '权重值必须在1到5之间');
            return;
        }
        weightMember.push(weightValue); // 确保权重为数字
    });

    let groupSize = parseInt(document.querySelector('#Number').value); // 确保groupSize为整数

    if (valueMember.length < groupSize) {
        setToasted(false, 'Insira mais pessoas');
    } else if (validateAllInput()) {
        let numGroups = 2; // 只分为两个组

        // 将成员和权重配对
        let membersWithWeight = valueMember.map((member, index) => ({
            member: member,
            weight: weightMember[index]
        }));

        // 随机打乱成员列表
        shuffleArray(membersWithWeight);

        // 初始化两个组
        let Groups = [[], []];
        let groupSums = [0, 0]; // 初始化两个组的总权重

        // 将成员随机分配到两个组
        membersWithWeight.forEach(({member, weight}, index) => {
            let groupIndex = index % 2; // 交替分配成员
            Groups[groupIndex].push({member, weight});
            groupSums[groupIndex] += weight;
        });

        // 如果权重差异过大，进行交换
        let weightDifference = Math.abs(groupSums[0] - groupSums[1]);
        if (weightDifference > 3) {
            // 交换权重差异较大的组的成员
            let maxGroupIndex = groupSums.indexOf(Math.max(...groupSums));
            let minGroupIndex = groupSums.indexOf(Math.min(...groupSums));

            // 从最大组中取出最大权重成员，从最小组中取出最小权重成员
            let maxWeightMember = getMaxWeightMember(Groups[maxGroupIndex]);
            let minWeightMember = getMinWeightMember(Groups[minGroupIndex]);

            // 交换成员
            if (maxWeightMember && minWeightMember) {
                swapMembers(Groups[maxGroupIndex], Groups[minGroupIndex], maxWeightMember, minWeightMember);
                // 更新权重
                groupSums[maxGroupIndex] -= maxWeightMember.weight;
                groupSums[minGroupIndex] -= minWeightMember.weight;
                groupSums[maxGroupIndex] += minWeightMember.weight;
                groupSums[minGroupIndex] += maxWeightMember.weight;
            }
        }

        // 分组动画
        outContainerAnimation();
        setTimeout(() => {
            innerDivGroupsOnHTML(Groups);
            document.querySelector('#btnContainer').style.justifyContent = 'space-around';
            document.querySelector('.btnModel:last-child').style.display = 'flex';
        }, 700);
    } else {
        setToasted(false, '所有都需填写');
    }
}

// 随机打乱数组顺序的函数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // 交换元素
    }
}

// 获取组中权重最大的成员
function getMaxWeightMember(group) {
    return group.reduce((max, current) => (current.weight > max.weight ? current : max), group[0]);
}

// 获取组中权重最小的成员
function getMinWeightMember(group) {
    return group.reduce((min, current) => (current.weight < min.weight ? current : min), group[0]);
}

// 交换两个组的成员
function swapMembers(group1, group2, maxWeightMember, minWeightMember) {
    // 从每个组中移除对应的成员
    let indexMax = group1.indexOf(maxWeightMember);
    let indexMin = group2.indexOf(minWeightMember);

    if (indexMax > -1) group1.splice(indexMax, 1);
    if (indexMin > -1) group2.splice(indexMin, 1);

    // 添加成员到对方组
    group1.push(minWeightMember);
    group2.push(maxWeightMember);
}

function outContainerAnimation() {
    var container = document.querySelector('#container');
    var btnContainer = document.querySelector('#btnContainer');
    var groupContainer = document.querySelector('#groupContainer');

    groupContainer.innerHTML = '';
    if (document.querySelectorAll('.modelGroupsCard').length < 1) {
        container.style.transform = `translateY(-${parseInt(document.querySelector('body').clientHeight - 541)}px)`;
        btnContainer.style.transform = `translateY(-${parseInt(document.querySelector('body').clientHeight - 421)}px)`;
        groupContainer.style.transform = `translateY(-${parseInt(document.querySelector('body').clientHeight - 361)}px)`;
        container.style.opacity = 0;
    }
}

function innerDivGroupsOnHTML(groups) {
    let colors = ['#FDDC5C', '#BDF6FE'];
    let groupContainer = document.querySelector('#groupContainer');
    groupContainer.innerHTML = '';

    for (let group in groups) {
        let color = colors[group % 2];
        groupContainer.insertAdjacentHTML('beforeend', `<div class="modelGroupsCard"></div>`);

        let groupCard = document.querySelectorAll('.modelGroupsCard');
        groupCard[group].style.backgroundColor = color;

        groups[group].forEach(memberObj => {
            groupCard[group].insertAdjacentHTML('beforeend', `<p>${memberObj.member} (权重: ${memberObj.weight})</p>`);
        });
    }
}

