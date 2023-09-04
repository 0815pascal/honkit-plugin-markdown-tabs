const css = `
<style>
* {
  box-sizing: border-box;
}

*:focus, input:focus + label {
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto 20px;
}

.radiotab {
  position: absolute;
  opacity: 0;
}

.label {
  width: 100%;
  padding: .75rem 1.6rem;
  background: rgb(245, 247, 249);
  z-index: 1;
  cursor: pointer;
  font-size: 1.4rem;
  color: rgb(136, 153, 168);
  border: 1px solid rgb(211, 220, 228);
  border-radius: 0;
  text-align: center;
  margin: 0 -1px -1px 0;
  text-rendering: optimizelegibility;
}

.label:first-of-type {
  border-radius: .4rem 0 0 0;
}

.label:last-of-type {
  border-radius: 0 .4rem 0 0;
}

.label:hover {
  background: rgb(233 235 237);
}

.label:active {
}

.radiotab:checked + .label {
  z-index: 3;
  color: rgb(59, 69, 78);
  border-bottom: 1px solid rgb(255, 255, 255);
  background: rgb(255, 255, 255);
}

.panel {
  display: none;
  padding: 3rem 1.6rem 1rem 1.6rem;
  width: 100%;
  z-index: 2;
  border-radius: 0 .4rem .4rem .4rem;
  border: 1px solid rgb(211, 220, 228);
  color: rgb(59, 69, 78);
  font-size: 1.5rem;
}

.radiotab:checked + .label + .panel {
  display: block;
}

@media (min-width: 600px) {
  .panel {
    order: 99;
  }

  .label {
    width: max-content;
  }

}
</style>
`;

module.exports = {
  hooks: {
    'page': function (page) {
      var content = page.content;
      var tabBlocks = content.split('<!-- tabs:end -->').filter(Boolean);

      tabBlocks.forEach(function (block) {
        var match = block.match(/<!-- tabs:start -->([\s\S]*)/);
        if (match) {
          var tabsHtml = '<div class="tabs">\n';
          var tabCount = 0;
          var tabContent = match[1].trim();
          var individualTabs = tabContent.split('<h2>').filter(Boolean);

          individualTabs.forEach(function (tab) {
            tabCount++;
            var lines = tab.split('\n');
            var tabName = lines[0].replace('</h2>', '').trim();
            var tabBody = lines.slice(1).join('\n').trim();
            var tabId = `tab${tabCount}`;
            var isChecked = tabCount === 1 ? 'checked="checked"' : '';

            tabsHtml += `
              <input class="radiotab" name="tabs" tabindex="1" type="radio" id="${tabId}" ${isChecked}>
              <label class="label" for="${tabId}">${tabName}</label>
              <div class="panel" tabindex="1">
                ${tabBody}
              </div>
            `;
          });

          tabsHtml += '</div>\n';
          content = content.replace(match[0], tabsHtml);
        }
      });

      page.content = content;
      if (!page.content.includes('<style>')) {
        page.content = css + page.content;
      }
      return page;
    }
  }
};
