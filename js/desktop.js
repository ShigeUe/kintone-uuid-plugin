/*
 * UUIDを設定する
 * Copyright (c) 2026 EICON
 */

((PLUGIN_ID) => {
  'use strict';

  const config = kintone.plugin.app.getConfig(PLUGIN_ID) || {};

  // 設定情報がなければ処理を終了する
  if (Object.keys(config).length === 0) {
    return;
  }

  const uuid_field_code = config.uuid;

  const disable_field = (event) => {
    event.record[uuid_field_code].disabled = true;
  };

  const crate_uuid = () => {
    return crypto.randomUUID().replaceAll('-', '');
  };

  kintone.events.on('app.record.index.edit.show', (event) => {
    // 一覧の時に編集させない
    disable_field(event);
    return event;
  });
  kintone.events.on(['app.record.edit.show', 'app.record.create.show'], (event) => {
    // 追加・編集画面で編集させない
    disable_field(event);

    // 指定フィールドが空の時、uuidを設定する
    const field = event.record[uuid_field_code];
    console.log(field);
    if (field.value == '' || field.value == null) {
      const new_uuid = crate_uuid();
      console.log(new_uuid);
      field.value = new_uuid;
    }
    return event;
  });

})(kintone.$PLUGIN_ID);
