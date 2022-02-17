/* eslint-disable no-undef */
/* eslint-disable no-useless-escape*/
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};
  
const mockRequest = (body) => {
  return {
    body
  };
};


const moodPayload = "{\"type\":\"block_actions\",\"user\":{\"id\":\"U012CAEHVF0\",\"username\":\"oparaprosper79\",\"name\":\"oparaprosper79\",\"team_id\":\"T012HLUEF2R\"},\"api_app_id\":\"A033X9ADU0G\",\"token\":\"hMCBp2D9xVUxhuppThcB5ffb\",\"container\":{\"type\":\"message_attachment\",\"message_ts\":\"1645129661.393559\",\"attachment_id\":1,\"channel_id\":\"C033XMZN9CH\",\"is_ephemeral\":false,\"is_app_unfurl\":false},\"trigger_id\":\"3120388974517.1085708491093.17515ec9496f63507286b954f5464235\",\"team\":{\"id\":\"T012HLUEF2R\",\"domain\":\"kodekagedev\"},\"enterprise\":null,\"is_enterprise_install\":false,\"channel\":{\"id\":\"C033XMZN9CH\",\"name\":\"intro\"},\"message\":{\"bot_id\":\"B0337H7EKH9\",\"type\":\"message\",\"text\":\"Welcome. How are you doing?\",\"user\":\"U0339S88NH2\",\"ts\":\"1645129661.393559\",\"team\":\"T012HLUEF2R\",\"attachments\":[{\"id\":1,\"blocks\":[{\"type\":\"section\",\"block_id\":\"RrFp7\",\"text\":{\"type\":\"mrkdwn\",\"text\":\"Choose an option that reflects how your mood\",\"verbatim\":false},\"accessory\":{\"type\":\"static_select\",\"action_id\":\"user_mood\",\"placeholder\":{\"type\":\"plain_text\",\"text\":\"Select mood\",\"emoji\":true},\"options\":[{\"text\":{\"type\":\"plain_text\",\"text\":\"Feeling Lucky\",\"emoji\":true},\"value\":\"Feeling Lucky\"},{\"text\":{\"type\":\"plain_text\",\"text\":\"Neutral\",\"emoji\":true},\"value\":\"Neutral\"},{\"text\":{\"type\":\"plain_text\",\"text\":\"Doing Well\",\"emoji\":true},\"value\":\"Doing Well\"}]}}],\"color\":\"#f2c744\",\"fallback\":\"[no preview available]\"}]},\"state\":{\"values\":{\"RrFp7\":{\"user_mood\":{\"type\":\"static_select\",\"selected_option\":{\"text\":{\"type\":\"plain_text\",\"text\":\"Feeling Lucky\",\"emoji\":true},\"value\":\"Feeling Lucky\"}}}}},\"response_url\":\"https:\/\/hooks.slack.com\/actions\/T012HLUEF2R\/3147043235168\/cx1OeJPGnnuCvQUgaIYYzti2\",\"actions\":[{\"type\":\"static_select\",\"action_id\":\"user_mood\",\"block_id\":\"RrFp7\",\"selected_option\":{\"text\":{\"type\":\"plain_text\",\"text\":\"Feeling Lucky\",\"emoji\":true},\"value\":\"Feeling Lucky\"},\"placeholder\":{\"type\":\"plain_text\",\"text\":\"Select mood\",\"emoji\":true},\"action_ts\":\"1645129670.207376\"}]}";

module.exports = { mockRequest, mockResponse, moodPayload };