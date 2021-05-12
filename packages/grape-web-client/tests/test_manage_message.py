import utils
import uuid
from selenium.webdriver.common.keys import Keys


class TestManageMessage(utils.TestCase):

    def test_send_message(self):
        utils.login_user(self.driver)
        chat_input = self.driver.find_element_by_xpath(
            "//textarea[@placeholder='Enter a message …']")
        content = f"Hello {uuid.uuid4().hex}!"
        chat_input.send_keys(content)
        chat_input.send_keys(Keys.RETURN)
        message = self.driver.find_element_by_xpath(
            f"//p[contains(text(), '{content}')]")
        self.assertIsNotNone(message)
