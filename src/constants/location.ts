export const Nations = [
  {
    id: "JP",
    name: "Japan",
    name_th: "ญี่ปุ่น",
    created_at: null,
    updated_at: null,
    deleted_at: null,
    is_active: true,
  },
  {
    id: "CN",
    name: "China",
    name_th: "จีน",
    created_at: null,
    updated_at: null,
    deleted_at: null,
    is_active: true,
  },
]

export const Provinces = [
  {
    nation_id: "JP",
    code: "JP-13",
    name_en: "Tokyo",
    name_th: "โตเกียว",
    name: "東京都",
    cities: [
      {
        code: "JP-13-101",
        name_en: "Shinjuku",
        name_th: "ชินจูกุ",
        name: "新宿区",
      },
      {
        code: "JP-13-102",
        name_en: "Shibuya",
        name_th: "ชิบุยะ",
        name: "渋谷区",
      },
      {
        code: "JP-13-103",
        name_en: "Chiyoda",
        name_th: "จิโยดะ",
        name: "千代田区",
      },
      {
        code: "JP-13-104",
        name_en: "Minato",
        name_th: "มินาโตะ",
        name: "港区",
      },
      {
        code: "JP-13-105",
        name_en: "Hachioji",
        name_th: "ฮาจิโอจิ",
        name: "八王子市",
      },
    ],
  },
  {
    nation_id: "JP",
    code: "JP-27",
    name_en: "Osaka",
    name_th: "โอซาก้า",
    name: "大阪府",
    cities: [
      {
        code: "JP-27-101",
        name_en: "Osaka City",
        name_th: "เมืองโอซาก้า",
        name: "大阪市",
      },
      {
        code: "JP-27-102",
        name_en: "Sakai",
        name_th: "ซาไก",
        name: "堺市",
      },
      {
        code: "JP-27-103",
        name_en: "Higashiosaka",
        name_th: "ฮิกาชิโอซาก้า",
        name: "東大阪市",
      },
    ],
  },
  {
    nation_id: "JP",
    code: "JP-26",
    name_en: "Kyoto",
    name_th: "เกียวโต",
    name: "京都府",
    cities: [
      {
        code: "JP-26-101",
        name_en: "Kyoto City",
        name_th: "เมืองเกียวโต",
        name: "京都市",
      },
      {
        code: "JP-26-102",
        name_en: "Uji",
        name_th: "อุจิ",
        name: "宇治市",
      },
    ],
  },
  {
    nation_id: "JP",
    code: "JP-01",
    name_en: "Hokkaido",
    name_th: "ฮอกไกโด",
    name: "北海道",
    cities: [
      {
        code: "JP-01-101",
        name_en: "Sapporo",
        name_th: "ซัปโปโร",
        name: "札幌市",
      },
      {
        code: "JP-01-102",
        name_en: "Hakodate",
        name_th: "ฮาโกดาเตะ",
        name: "函館市",
      },
      {
        code: "JP-01-103",
        name_en: "Asahikawa",
        name_th: "อาซาฮิคาว่า",
        name: "旭川市",
      },
      {
        code: "JP-01-104",
        name_en: "Otaru",
        name_th: "โอตารุ",
        name: "小樽市",
      },
    ],
  },
  {
    nation_id: "JP",
    code: "JP-14",
    name_en: "Kanagawa",
    name_th: "คานากาว่า",
    name: "神奈川県",
    cities: [
      {
        code: "JP-14-101",
        name_en: "Yokohama",
        name_th: "โยโกฮาม่า",
        name: "横浜市",
      },
      {
        code: "JP-14-102",
        name_en: "Kawasaki",
        name_th: "คาวาซากิ",
        name: "川崎市",
      },
      {
        code: "JP-14-103",
        name_en: "Kamakura",
        name_th: "คามาคุระ",
        name: "鎌倉市",
      },
      {
        code: "JP-14-104",
        name_en: "Hakone",
        name_th: "ฮาโกเน่",
        name: "箱根町",
      },
    ],
  },
  {
    nation_id: "JP",
    code: "JP-40",
    name_en: "Fukuoka",
    name_th: "ฟุกุโอกะ",
    name: "福岡県",
    cities: [
      {
        code: "JP-40-101",
        name_en: "Fukuoka City",
        name_th: "เมืองฟุกุโอกะ",
        name: "福岡市",
      },
      {
        code: "JP-40-102",
        name_en: "Kitakyushu",
        name_th: "คิตะคิวชู",
        name: "北九州市",
      },
    ],
  },
  {
    nation_id: "JP",
    code: "JP-23",
    name_en: "Aichi",
    name_th: "ไอจิ",
    name: "愛知県",
    cities: [
      {
        code: "JP-23-101",
        name_en: "Nagoya",
        name_th: "นาโกย่า",
        name: "名古屋市",
      },
      {
        code: "JP-23-102",
        name_en: "Toyota",
        name_th: "โตโยต้า",
        name: "豊田市",
      },
    ],
  },
  {
    nation_id: "JP",
    code: "JP-47",
    name_en: "Okinawa",
    name_th: "โอกินาวา",
    name: "沖縄県",
    cities: [
      {
        code: "JP-47-101",
        name_en: "Naha",
        name_th: "นาฮา",
        name: "那覇市",
      },
      {
        code: "JP-47-102",
        name_en: "Okinawa City",
        name_th: "เมืองโอกินาวา",
        name: "沖縄市",
      },
    ],
  },
  {
    nation_id: "CN",
    code: "CN-BJ",
    name_en: "Beijing",
    name_th: "ปักกิ่ง",
    name: "北京市",
    cities: [
      {
        code: "CN-BJ-01",
        name_en: "Dongcheng",
        name_th: "ตงเฉิง",
        name: "东城区",
      },
      {
        code: "CN-BJ-02",
        name_en: "Xicheng",
        name_th: "ซีเฉิง",
        name: "西城区",
      },
      {
        code: "CN-BJ-05",
        name_en: "Chaoyang",
        name_th: "เฉาหยาง",
        name: "朝阳区",
      },
      {
        code: "CN-BJ-08",
        name_en: "Haidian",
        name_th: "ไห่เตี้ยน",
        name: "海淀区",
      },
    ],
  },
  {
    nation_id: "CN",
    code: "CN-SH",
    name_en: "Shanghai",
    name_th: "เซี่ยงไฮ้",
    name: "上海市",
    cities: [
      {
        code: "CN-SH-01",
        name_en: "Huangpu",
        name_th: "หวงผู่",
        name: "黄浦区",
      },
      {
        code: "CN-SH-06",
        name_en: "Jing'an",
        name_th: "จิ้งอัน",
        name: "静安区",
      },
      {
        code: "CN-SH-15",
        name_en: "Pudong New Area",
        name_th: "ผู่ตง",
        name: "浦东新区",
      },
      {
        code: "CN-SH-04",
        name_en: "Xuhui",
        name_th: "ซูฮุ่ย",
        name: "徐汇区",
      },
    ],
  },
  {
    nation_id: "CN",
    code: "CN-GD",
    name_en: "Guangdong",
    name_th: "กวางตุ้ง",
    name: "广东省",
    cities: [
      {
        code: "CN-GD-01",
        name_en: "Guangzhou",
        name_th: "กว่างโจว",
        name: "广州市",
      },
      {
        code: "CN-GD-03",
        name_en: "Shenzhen",
        name_th: "เซินเจิ้น",
        name: "深圳市",
      },
      {
        code: "CN-GD-04",
        name_en: "Zhuhai",
        name_th: "จูไห่",
        name: "珠海市",
      },
      {
        code: "CN-GD-06",
        name_en: "Foshan",
        name_th: "ฝอซาน",
        name: "佛山市",
      },
      {
        code: "CN-GD-19",
        name_en: "Dongguan",
        name_th: "ตงกวน",
        name: "东莞市",
      },
    ],
  },
  {
    nation_id: "CN",
    code: "CN-ZJ",
    name_en: "Zhejiang",
    name_th: "เจ้อเจียง",
    name: "浙江省",
    cities: [
      {
        code: "CN-ZJ-01",
        name_en: "Hangzhou",
        name_th: "หางโจว",
        name: "杭州市",
      },
      {
        code: "CN-ZJ-02",
        name_en: "Ningbo",
        name_th: "หนิงโป",
        name: "宁波市",
      },
      {
        code: "CN-ZJ-07",
        name_en: "Jinhua (Yiwu)",
        name_th: "จินหัว (อี้อู)",
        name: "金华市",
      },
    ],
  },
  {
    nation_id: "CN",
    code: "CN-JS",
    name_en: "Jiangsu",
    name_th: "เจียงซู",
    name: "江苏省",
    cities: [
      {
        code: "CN-JS-01",
        name_en: "Nanjing",
        name_th: "หนานจิง",
        name: "南京市",
      },
      {
        code: "CN-JS-05",
        name_en: "Suzhou",
        name_th: "ซูโจว",
        name: "苏州市",
      },
      {
        code: "CN-JS-02",
        name_en: "Wuxi",
        name_th: "อู๋ซี",
        name: "无锡市",
      },
    ],
  },
  {
    nation_id: "CN",
    code: "CN-SC",
    name_en: "Sichuan",
    name_th: "เสฉวน",
    name: "四川省",
    cities: [
      {
        code: "CN-SC-01",
        name_en: "Chengdu",
        name_th: "เฉิงตู",
        name: "成都市",
      },
      {
        code: "CN-SC-07",
        name_en: "Mianyang",
        name_th: "เหมียนหยาง",
        name: "绵阳市",
      },
      {
        code: "CN-SC-13",
        name_en: "Nanchong",
        name_th: "หนานชง",
        name: "南充市",
      },
    ],
  },
  {
    nation_id: "CN",
    code: "CN-CQ",
    name_en: "Chongqing",
    name_th: "ฉงชิ่ง",
    name: "重庆市",
    cities: [
      {
        code: "CN-CQ-03",
        name_en: "Yuzhong",
        name_th: "อวี๋จง",
        name: "渝中区",
      },
      {
        code: "CN-CQ-05",
        name_en: "Jiangbei",
        name_th: "เจียงเป่ย",
        name: "江北区",
      },
      {
        code: "CN-CQ-06",
        name_en: "Shapingba",
        name_th: "ซาผิงป้า",
        name: "沙坪坝区",
      },
    ],
  },
  {
    nation_id: "CN",
    code: "CN-YN",
    name_en: "Yunnan",
    name_th: "ยูนนาน",
    name: "云南省",
    cities: [
      {
        code: "CN-YN-01",
        name_en: "Kunming",
        name_th: "คุนหมิง",
        name: "昆明市",
      },
      {
        code: "CN-YN-29",
        name_en: "Dali",
        name_th: "ต้าหลี่",
        name: "大理白族自治州",
      },
      {
        code: "CN-YN-07",
        name_en: "Lijiang",
        name_th: "ลี่เจียง",
        name: "丽江市",
      },
      {
        code: "CN-YN-28",
        name_en: "Xishuangbanna",
        name_th: "สิบสองปันนา",
        name: "西双版纳傣族自治州",
      },
    ],
  },
  {
    nation_id: "CN",
    code: "CN-FJ",
    name_en: "Fujian",
    name_th: "ฮกเกี้ยน (ฝูเจี้ยน)",
    name: "福建省",
    cities: [
      {
        code: "CN-FJ-01",
        name_en: "Fuzhou",
        name_th: "ฝูโจว",
        name: "福州市",
      },
      {
        code: "CN-FJ-02",
        name_en: "Xiamen",
        name_th: "เซียะเหมิน",
        name: "厦门市",
      },
      {
        code: "CN-FJ-05",
        name_en: "Quanzhou",
        name_th: "จวนโจว",
        name: "泉州市",
      },
    ],
  },
  {
    nation_id: "CN",
    code: "CN-SD",
    name_en: "Shandong",
    name_th: "ซานตง",
    name: "山东省",
    cities: [
      {
        code: "CN-SD-01",
        name_en: "Jinan",
        name_th: "จี่หนาน",
        name: "济南市",
      },
      {
        code: "CN-SD-02",
        name_en: "Qingdao",
        name_th: "ชิงเต่า",
        name: "青岛市",
      },
    ],
  },
]

export const getLocationName = (
  provinceCode?: string,
  districtCode?: string,
  nationId?: string,
) => {
  let provinceData = Provinces.find((p) => p.code === provinceCode)

  if (!provinceData && districtCode) {
    provinceData = Provinces.find((p) => p.cities?.some((c) => c.code === districtCode))
  }

  const provinceName = provinceData?.name_th || provinceCode || ""
  const districtData = provinceData?.cities?.find((c) => c.code === districtCode)
  const districtName = districtData?.name_th || districtCode || ""

  const nationData = Nations.find((n) => n.id === (nationId || provinceData?.nation_id))
  const nationName = nationData?.name_th || nationId || ""

  return {
    provinceName,
    districtName,
    nationName,
    provinceData,
    districtData,
    nationData,
  }
}
