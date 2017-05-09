# Start

## 1. start mysql swagger api
```
cd blockinfo_mysql
swagger roject start
```

## 2. start front end
```
cd front/app4
./iniS
```


# MYSQL
```
#通道
create table channels(
channel_name char(100) not null primary key, #channel名, 主键
height int not null, #高度
current_block_hash binary(255) not null, #当前区块hash
previous_block_hash binary(255)  #前一区块hash
);

#区块
create table blocks(
number int(4) not null primary key, #该区块高度, 主键
previous_hash binary(255), #前一区块hash
data_hash binary(255)
);

#交易
create table transactions(
tx_i_d binary(255) not null primary key,
type char(20) not null,
# version int(4),
timestamp char(20),
chaincode_name char(100),
channel_name char(100) not null,
number int(4) not null,
FOREIGN KEY (channel_name) REFERENCES channels(channel_name),
FOREIGN KEY (number) REFERENCES blocks(number)
);
```