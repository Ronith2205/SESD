%%writefile test_bank.py
import pytest
from bank import Account, SavingsAccount, CurrentAccount

@pytest.fixture
def setup_accounts():
    acc1 = SavingsAccount("S001", 1000)
    acc2 = CurrentAccount("C001", 500)
    return acc1, acc2

def test_deposit(setup_accounts):
    acc1, _ = setup_accounts
    acc1.deposit(500)
    assert acc1.balance == 1500

def test_withdraw_valid(setup_accounts):
    acc1, _ = setup_accounts
    acc1.withdraw(200)
    assert acc1.balance == 800

def test_withdraw_insufficient(setup_accounts):
    acc1, _ = setup_accounts
    with pytest.raises(ValueError, match="Insufficient balance"):
        acc1.withdraw(2000)

def test_transfer(setup_accounts):
    acc1, acc2 = setup_accounts
    acc1.transfer(acc2, 300)
    assert acc1.balance == 700
    assert acc2.balance == 800

def test_interest_applied_to_savings(setup_accounts):
    acc1, _ = setup_accounts
    interest = acc1.calculate_interest()
    assert interest == 1000 * 0.05
    assert acc1.balance == 1050

def test_interest_not_in_current():
    acc = CurrentAccount("C002", 1000)
    with pytest.raises(AttributeError):
        acc.calculate_interest()
