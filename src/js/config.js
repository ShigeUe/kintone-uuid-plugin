(async (PLUGIN_ID) => {
  'use strict';
  // プラグインの設定情報を取得
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  // UUIDのSELECTボックス
  const uuidSelectElement = document.getElementById('uuid-field');
  // アプリID取得
  const appId = kintone.app.getId();

  // エスケープ用関数
  const escapeHtml = (htmlstr) => {
    return htmlstr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\n/g, '&#xA;');
  };

  // セレクトボックスの項目を作成
  const createOptions = async () => {
    let options = [];
    const client = new KintoneRestAPIClient();
    const appId = kintone.app.getId();
    const { properties } = await client.app.getFormFields({ app: appId });
    // フィールド型が「文字列（１行）」フィールド情報を取得
    const fields = Object.values(properties).filter(
      (field) => field.type === 'SINGLE_LINE_TEXT'
    );
    fields.forEach((field) => {
      const option = document.createElement('option');
      option.value = field.code;
      option.textContent = field.label;
      options = options.concat(option);
    });
    return options;
  };

  // フィールド一覧を取得
  const selectBoxOptions = await createOptions();

  // オプションに一覧を追加
  selectBoxOptions.forEach((originalOption) => {
    uuidSelectElement.appendChild(originalOption.cloneNode(true));
  });

  // 設定にある値をフォームに設定
  uuidSelectElement.value = config.uuid || '';

  // 「保存する」ボタンが押下時に設定を書き込む
  document.getElementById('submit').addEventListener('click', () => {
    // 念のためエスケープする
    const uuid = escapeHtml(uuidSelectElement.value);
    if (uuid === '') {
      alert('UUIDを設定するフィールドを選択してください');
      return;
    }
    kintone.plugin.app.setConfig({ uuid }, () => {
      window.location.href = `/k/admin/app/flow?app=${appId}`;
    })
  });

  // 「キャンセル」ボタン押下時にプラグイン一覧画面に遷移する
  document.getElementById('cancel').addEventListener('click', () => {
    // プラグイン一覧画面に遷移する
    window.location.href = `/k/admin/app/${appId}/plugin/`;
  });

})(kintone.$PLUGIN_ID);