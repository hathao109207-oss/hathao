<?php
// Simple SMTP client (minimal) for educational project
class SimpleSMTP {
    public $host;
    public $port = 587;
    public $username;
    public $password;
    public $secure = 'tls'; // tls or none
    public $timeout = 20;

    private $sock;

    private function expect($code){
        $data = '';
        while (($line = fgets($this->sock, 515)) !== false) {
            $data .= $line;
            if (preg_match('/^\d{3}\s/', $line)) break;
        }
        if (strpos($data, (string)$code) !== 0) {
            throw new Exception("SMTP error, expected $code, got: " . $data);
        }
        return $data;
    }

    private function cmd($cmd, $expect){
        fwrite($this->sock, $cmd . "\r\n");
        return $this->expect($expect);
    }

    public function connect(){
        $this->sock = fsockopen($this->host, $this->port, $errno, $errstr, $this->timeout);
        if (!$this->sock) throw new Exception("Cannot connect SMTP: $errstr ($errno)");
        $this->expect(220);
        $this->cmd("EHLO localhost", 250);

        if ($this->secure === 'tls') {
            $this->cmd("STARTTLS", 220);
            stream_socket_enable_crypto($this->sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            $this->cmd("EHLO localhost", 250);
        }

        if ($this->username) {
            $this->cmd("AUTH LOGIN", 334);
            $this->cmd(base64_encode($this->username), 334);
            $this->cmd(base64_encode($this->password), 235);
        }
    }

    public function send($from, $to, $subject, $bodyHtml){
        $this->cmd("MAIL FROM:<$from>", 250);
        $this->cmd("RCPT TO:<$to>", 250);
        $this->cmd("DATA", 354);

        $headers = "From: <$from>\r\n";
        $headers .= "To: <$to>\r\n";
        $headers .= "Subject: " . $subject . "\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

        $data = $headers . "\r\n" . $bodyHtml . "\r\n.";
        fwrite($this->sock, $data . "\r\n");
        $this->expect(250);
    }

    public function close(){
        if ($this->sock){
            @fwrite($this->sock, "QUIT\r\n");
            @fclose($this->sock);
        }
    }
}
?>
