# RedPacket Contrat Test

## CreateRedPacket

|#|Name|Expect|Done|
|---|----|------|---|
|1|设置 amount = 0.9 cpc|Fail|Done|
|2|设置 amount = 1 cpc|Success|Done|
|3|设置 amount = 99 cpc|Success|Done|
|4|设置 amount = 100 cpc|Fail|Done|
|5|设置 count = 0 |Fail|Done|
|6|设置 count = 1 |Success|Done|
|7|设置 count = 100 |Success|Done|
|8|设置 count = 101 |Fail|Done|
|9|设置 bless = "" |Success|Done|
|10|设置 bless = "H测试 -！@3$%^^&" |Success|Done|
|11|设置 bless = "a"*99 |Success|Done|
|12|设置 bless = "a"*100 |Fail|Done|
|13|设置 upper = 0.9 |Fail|Done|
|14|设置 upper = 1 |Success|Done|
|15|设置 upper = 50 |Success|Done|
|16|设置 upper = 1000000 |Success|Done|
|17|设置 upper = 1000001 |Fail|Done|
|18|设置 sub_packet_cnt_upper = 1 |Fail|Done|
|19|设置 sub_packet_cnt_upper = 2 |Success|Done|

## GrabRedPacket

|#|Name|Expect|Done|
|---|----|------|---|
|1|设置 红包个数为5，抢红包人数为5|Success|Done|
|2|设置 红包个数为5，抢红包人数为6|Fail|Done|
|3|设置 红包不存在|Fail|Done|
|4|设置 红包已经被抢过了|Fail|Done|

## Refund

|#|Name|Expect|Done|
|---|----|------|---|
|1|设置 period=5s|Success|Done|
|2|设置 剩余红包个数为2，剩余金额不为0|Success|Done|
|3|设置 剩余红包个数为0|Fail|Done|
|4|设置 红包不存在|Fail|Done|
|5|设置 红包不属于你|Fail|Done|
|6|设置 红包时间未到|Fail|Done|
|7|设置 红包退款后再抢|Fail|Done|
