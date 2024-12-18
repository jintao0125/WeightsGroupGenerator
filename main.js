let records = [];

function generateInputs() {
    const defaultMembers = [
        { name: '铁蛋', weight: 5 },
        { name: '红旗', weight: 5 },
        { name: '捞得一', weight: 4 },
        { name: '张国荣', weight: 4 },
        { name: '勾栏听曲', weight: 4 },
        { name: '后知后觉', weight: 4 },
        { name: '小萝莉', weight: 3 },
        { name: '云白', weight: 4 }
    ];

    const membersInputs = document.getElementById('membersInputs');
    membersInputs.innerHTML = '';
    
    defaultMembers.forEach(member => {
        const div = document.createElement('div');
        div.innerHTML = `
            <input type="text" placeholder="成员姓名" value="${member.name}">
            <input type="number" placeholder="权重" min="1" value="${member.weight}">
        `;
        membersInputs.appendChild(div);
    });
    
    // 设置成员数量输入框的值
    document.getElementById('numMembers').value = defaultMembers.length;
}

function createGroups() {
    const membersInputs = document.getElementById('membersInputs');
    
    // 检查是否已生成输入框
    if (!membersInputs.children.length) {
        alert('请先点击生成按钮生成成员输入框');
        return;
    }

    const members = [];
    for (let input of membersInputs.children) {
        const name = input.children[0].value;
        const weight = parseInt(input.children[1].value);
        if (!name || isNaN(weight)) {
            alert('请填写所有成员的姓名和权重');
            return;
        }
        members.push({ name, weight });
    }

    members.sort((a, b) => b.weight - a.weight);

    const group1 = [];
    const group2 = [];
    let weight1 = 0;
    let weight2 = 0;

    for (let member of members) {
        if (weight1 <= weight2) {
            group1.push(member.name);
            weight1 += member.weight;
        } else {
            group2.push(member.name);
            weight2 += member.weight;
        }
    }

    const groupsDiv = document.getElementById('groups');
    // 确保分组区域可见
    groupsDiv.style.display = 'block';
    groupsDiv.innerHTML = `
        <div class="record-item">
            <h2>小组 1</h2>
            <ul class="members-list">${group1.map(name => {
                const member = members.find(m => m.name === name);
                return `<li>${name} (权重: ${member.weight})</li>`;
            }).join('')}</ul>
            <h2>小组 2</h2>
            <ul class="members-list">${group2.map(name => {
                const member = members.find(m => m.name === name);
                return `<li>${name} (权重: ${member.weight})</li>`;
            }).join('')}</ul>
            <button onclick="recordResult('group1')">小组 1 胜利</button>
            <button onclick="recordResult('group2')">小组 2 胜利</button>
        </div>
    `;

    records.push({ group1, group2, members });
}

function createRandomGroups() {
    const membersInputs = document.getElementById('membersInputs');
    
    // 检查是否已生成输入框
    if (!membersInputs.children.length) {
        alert('请先点击生成按钮生成成员输入框');
        return;
    }

    const members = [];
    for (let input of membersInputs.children) {
        const name = input.children[0].value;
        const weight = parseInt(input.children[1].value);
        if (!name || isNaN(weight)) {
            alert('请填写所有成员的姓名和权重');
            return;
        }
        members.push({ name, weight });
    }

    // 随机打乱数组
    members.sort(() => Math.random() - 0.5);

    const group1 = [];
    const group2 = [];
    let weight1 = 0;
    let weight2 = 0;

    for (let member of members) {
        if (weight1 <= weight2) {
            group1.push(member.name);
            weight1 += member.weight;
        } else {
            group2.push(member.name);
            weight2 += member.weight;
        }
    }

    const groupsDiv = document.getElementById('groups');
    groupsDiv.style.display = 'block';
    groupsDiv.innerHTML = `
        <div class="record-item">
            <h2>小组 1</h2>
            <ul class="members-list">${group1.map(name => {
                const member = members.find(m => m.name === name);
                return `<li>${name} (权重: ${member.weight})</li>`;
            }).join('')}</ul>
            <h2>小组 2</h2>
            <ul class="members-list">${group2.map(name => {
                const member = members.find(m => m.name === name);
                return `<li>${name} (权重: ${member.weight})</li>`;
            }).join('')}</ul>
            <button onclick="recordResult('group1')">小组 1 胜利</button>
            <button onclick="recordResult('group2')">小组 2 胜利</button>
        </div>
    `;

    records.push({ group1, group2, members });
}

function recordResult(winner) {
    const lastRecord = records[records.length - 1];
    lastRecord.result = winner;
    alert(`${winner === 'group1' ? '小组 1' : '小组 2'} 胜利`);
    // 同时隐藏分组记录和当前分组
    document.getElementById('records').style.display = 'none';
    document.getElementById('groups').style.display = 'none';
}

function showRecords() {
    const recordsDiv = document.getElementById('records');
    if (recordsDiv.style.display === 'block') {
        recordsDiv.style.display = 'none';
        return;
    }
    
    recordsDiv.style.display = 'block';
    recordsDiv.innerHTML = records.map((record, index) => `
        <div class="record-item">
            <div class="record-header">
                <span>分组记录 ${index + 1}</span>
                <span class="result">${record.result === 'group1' ? '小组 1 胜利' : '小组 2 胜利'}</span>
            </div>
            <div class="group-row">
                <span>小组 1：</span>
                <ul class="members-list">${record.group1.map(name => `<li>${name}</li>`).join('')}</ul>
            </div>
            <div class="group-row">
                <span>小组 2：</span>
                <ul class="members-list">${record.group2.map(name => `<li>${name}</li>`).join('')}</ul>
            </div>
        </div>
    `).join('');
}
