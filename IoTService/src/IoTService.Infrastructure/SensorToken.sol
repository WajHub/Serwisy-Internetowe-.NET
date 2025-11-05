// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "./IERC20.sol";

contract SensorToken is IERC20 {
    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowed;
    uint256 private _totalSupply;

    string private _name;
    string private _symbol;
    uint8 private _decimals;
    address public owner;

    constructor() {
        _totalSupply = 1000000 * 10;
        _balances[msg.sender] = _totalSupply;
        _name = "SensorToken";
        _symbol = "STK";
        _decimals = 18;
        owner = msg.sender;
    }

    function name() public override view returns (string memory) {
        return _name;
    }
    
    function symbol() public override view returns (string memory) {
        return _symbol;
    }

    function decimals() public override view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public override view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner) public override view returns (uint256 balance) {
        return _balances[_owner];
    }

    function transfer(address _to, uint256 _value) public override returns (bool success) {
        require(_balances[msg.sender] >= _value, "account balance does not have enough tokens");
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;
        
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public override returns (bool success) {
        require(_balances[_from] >= _value,"account balance does not have enough tokens");
        require(_allowed[_from][msg.sender] >= _value, " allowance is lower than amount requested");
        
        _balances[_from] -= _value;
        _balances[_to] += _value;
        _allowed[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public override returns (bool success) {
        _allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public override view returns (uint256 remaining) {
        return _allowed[_owner][_spender];
    }
}