<?php
// Minimal PHPMailer-like wrapper using SimpleSMTP (for project requirement)
require_once __DIR__ . '/class.smtp.php';

class PHPMailer {
    public $Host;
    public $Port = 587;
    public $Username;
    public $Password;
    public $SMTPSecure = 'tls';
    public $From;
    public $FromName = '';
    public $Subject = '';
    public $Body = '';
    public $CharSet = 'UTF-8';
    private $to = [];

    public function isSMTP(){ /* marker */ }
    public function addAddress($email){ $this->to[] = $email; }

    public function send(){
        if (empty($this->to)) throw new Exception("No recipient");
        $smtp = new SimpleSMTP();
        $smtp->host = $this->Host;
        $smtp->port = (int)$this->Port;
        $smtp->username = $this->Username;
        $smtp->password = $this->Password;
        $smtp->secure = $this->SMTPSecure ?: 'none';

        $smtp->connect();
        try {
            foreach ($this->to as $rcpt){
                $from = $this->From ?: $this->Username;
                $smtp->send($from, $rcpt, $this->Subject, $this->Body);
            }
        } finally {
            $smtp->close();
        }
        return true;
    }
}
?>
