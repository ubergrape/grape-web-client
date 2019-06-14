import os
import unittest
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


key = os.environ['BROWSERSTACK_AUTH_KEY']
executor = f"http://stefangraper1:{key}@hub.browserstack.com:80/wd/hub"


class TestCase(unittest.TestCase):
    def __init__(self, testname):
        super(TestCase, self).__init__(testname)
        # needs to be setup in __init__ and not in setUp since we patch it
        # sometimes to run the suite with another browser
        self.desired_cap = {
            'browser': 'Chrome',
            'browser_version': '62.0',
            'os': 'Windows',
            'os_version': '10',
            'resolution': '1024x768',
            'browserstack.local': True
        }

    def setUp(self):
        self.driver = webdriver.Remote(
            command_executor=executor,
            desired_capabilities=self.desired_cap)

    def tearDown(self):
        self.driver.quit()


def login_user(driver):
    driver.get("http://localhost")
    # enter username
    username_input = driver.find_element_by_name("username")
    username_input.send_keys("admin")
    # enter password
    password_input = driver.find_element_by_name("password")
    password_input.send_keys("admin")
    # submit login
    login_form = driver.find_element_by_id('loginForm')
    login_form.submit()

    try:
        wait = EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(), 'New Conversation')]"))
        WebDriverWait(driver, 15).until(wait)
    except TimeoutException:
        raise TimeoutException('Unable to load the Grape app after 15s')
